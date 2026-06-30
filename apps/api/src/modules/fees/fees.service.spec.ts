import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';
import { FeesService } from './fees.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';

describe('FeesService', () => {
  let feesService: FeesService;
  let prisma: {
    invoice: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock; count: jest.Mock };
    payment: { create: jest.Mock; findMany: jest.Mock };
  };

  const user: AuthUser = {
    id: 'user-1',
    email: 'accountant@unifyclub.org',
    firstName: 'Acc',
    lastName: 'Ountant',
    roles: ['Accountant'],
    permissions: ['fees:create', 'fees:read', 'fees:update'],
    branchIds: ['branch-pechs'],
    isCrossBranch: false,
  };

  const dueInFuture = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const dueInPast = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const baseInvoice = {
    id: 'invoice-1',
    branchId: 'branch-pechs',
    invoiceNumber: 'INV-202606-0001',
    dueDate: dueInFuture,
    subtotal: 5000,
    discount: 0,
    total: 5000,
    amountPaid: 0,
    status: InvoiceStatus.ISSUED,
  };

  beforeEach(() => {
    prisma = {
      invoice: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      payment: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };
    feesService = new FeesService(prisma as unknown as PrismaService);
  });

  describe('createInvoice', () => {
    it('computes subtotal/total from line items and generates a sequenced invoice number', async () => {
      prisma.invoice.count.mockResolvedValueOnce(3); // 3 existing invoices this month
      prisma.invoice.create.mockImplementationOnce(({ data }) =>
        Promise.resolve({ ...baseInvoice, ...data, id: 'invoice-new' }),
      );

      const dto = {
        branchId: 'branch-pechs',
        dueDate: dueInFuture.toISOString(),
        discount: 500,
        items: [
          { description: 'Monthly therapy fee', amount: 4000 },
          { description: 'Materials', amount: 1500 },
        ],
      } as any;

      const invoice = await feesService.createInvoice(user, dto);

      expect(invoice.subtotal).toBe(5500);
      expect(invoice.discount).toBe(500);
      expect(invoice.total).toBe(5000);
      expect(invoice.invoiceNumber).toMatch(/^INV-\d{6}-0004$/);
      expect(invoice.status).toBe(InvoiceStatus.ISSUED);
    });
  });

  describe('findOneInvoice / derived status', () => {
    it('throws NotFoundException for a missing invoice', async () => {
      prisma.invoice.findUnique.mockResolvedValueOnce(null);

      await expect(feesService.findOneInvoice(user, 'missing-id')).rejects.toThrow(NotFoundException);
    });

    it('derives OVERDUE for an unpaid invoice whose due date has passed', async () => {
      prisma.invoice.findUnique.mockResolvedValueOnce({ ...baseInvoice, dueDate: dueInPast });

      const invoice = await feesService.findOneInvoice(user, baseInvoice.id);

      expect(invoice.status).toBe(InvoiceStatus.OVERDUE);
    });

    it('does not override PAID status even if the due date has passed', async () => {
      prisma.invoice.findUnique.mockResolvedValueOnce({
        ...baseInvoice,
        dueDate: dueInPast,
        status: InvoiceStatus.PAID,
        amountPaid: 5000,
      });

      const invoice = await feesService.findOneInvoice(user, baseInvoice.id);

      expect(invoice.status).toBe(InvoiceStatus.PAID);
    });

    it('keeps a future-dated unpaid invoice as ISSUED (not overdue)', async () => {
      prisma.invoice.findUnique.mockResolvedValueOnce({ ...baseInvoice });

      const invoice = await feesService.findOneInvoice(user, baseInvoice.id);

      expect(invoice.status).toBe(InvoiceStatus.ISSUED);
    });
  });

  describe('recordPayment', () => {
    it('marks the invoice PARTIALLY_PAID when payment is less than the total', async () => {
      prisma.invoice.findUnique
        .mockResolvedValueOnce({ ...baseInvoice }) // initial lookup
        .mockResolvedValueOnce({ ...baseInvoice, amountPaid: 2000, status: InvoiceStatus.PARTIALLY_PAID }); // findOneInvoice at the end
      prisma.payment.create.mockResolvedValueOnce({});
      prisma.payment.findMany.mockResolvedValueOnce([{ amount: 2000 }]);
      prisma.invoice.update.mockResolvedValueOnce({});

      const result = await feesService.recordPayment(user, baseInvoice.id, {
        amount: 2000,
        method: PaymentMethod.CASH,
      } as any);

      expect(prisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amountPaid: 2000, status: InvoiceStatus.PARTIALLY_PAID }),
        }),
      );
      expect(result.status).toBe(InvoiceStatus.PARTIALLY_PAID);
    });

    it('marks the invoice PAID once cumulative payments cover the total', async () => {
      prisma.invoice.findUnique
        .mockResolvedValueOnce({ ...baseInvoice })
        .mockResolvedValueOnce({ ...baseInvoice, amountPaid: 5000, status: InvoiceStatus.PAID });
      prisma.payment.create.mockResolvedValueOnce({});
      prisma.payment.findMany.mockResolvedValueOnce([{ amount: 5000 }]);
      prisma.invoice.update.mockResolvedValueOnce({});

      const result = await feesService.recordPayment(user, baseInvoice.id, {
        amount: 5000,
        method: PaymentMethod.BANK_TRANSFER,
      } as any);

      expect(prisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amountPaid: 5000, status: InvoiceStatus.PAID }),
        }),
      );
      expect(result.status).toBe(InvoiceStatus.PAID);
    });

    it('rejects further payment on an already-PAID invoice', async () => {
      prisma.invoice.findUnique.mockResolvedValueOnce({ ...baseInvoice, status: InvoiceStatus.PAID });

      await expect(
        feesService.recordPayment(user, baseInvoice.id, { amount: 100, method: PaymentMethod.CASH } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects payment on a cancelled invoice', async () => {
      prisma.invoice.findUnique.mockResolvedValueOnce({ ...baseInvoice, status: InvoiceStatus.CANCELLED });

      await expect(
        feesService.recordPayment(user, baseInvoice.id, { amount: 100, method: PaymentMethod.CASH } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
