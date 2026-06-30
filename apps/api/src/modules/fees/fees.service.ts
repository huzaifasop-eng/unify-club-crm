import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import {
  CreateFeeStructureDto,
  CreateInvoiceDto,
  RecordPaymentDto,
  UpdateFeeStructureDto,
} from './dto/fee.dto';

const invoiceInclude = {
  items: true,
  payments: { orderBy: { paidAt: 'desc' as const } },
  child: { select: { id: true, firstName: true, lastName: true } },
  branch: { select: { id: true, name: true, code: true } },
};

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  // ---------------------------------------------------------------------
  // Fee Structures
  // ---------------------------------------------------------------------

  async createFeeStructure(user: AuthUser, dto: CreateFeeStructureDto) {
    return this.prisma.feeStructure.create({
      data: {
        branchId: dto.branchId,
        name: dto.name,
        description: dto.description,
        amount: dto.amount,
        frequency: dto.frequency,
      },
    });
  }

  async findAllFeeStructures(user: AuthUser, branchId?: string) {
    const where: Prisma.FeeStructureWhereInput = {
      ...branchScopeWhere(user, branchId),
    };
    return this.prisma.feeStructure.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  private async findOneFeeStructure(user: AuthUser, id: string) {
    const feeStructure = await this.prisma.feeStructure.findUnique({ where: { id } });
    if (!feeStructure) throw new NotFoundException('Fee structure not found');
    branchScopeWhere(user, feeStructure.branchId);
    return feeStructure;
  }

  async updateFeeStructure(user: AuthUser, id: string, dto: UpdateFeeStructureDto) {
    await this.findOneFeeStructure(user, id);
    return this.prisma.feeStructure.update({
      where: { id },
      data: { ...dto },
    });
  }

  async removeFeeStructure(user: AuthUser, id: string) {
    await this.findOneFeeStructure(user, id);
    return this.prisma.feeStructure.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ---------------------------------------------------------------------
  // Invoices
  // ---------------------------------------------------------------------

  private async generateInvoiceNumber() {
    const now = new Date();
    const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prefix = `INV-${yyyymm}-`;
    const count = await this.prisma.invoice.count({
      where: { invoiceNumber: { startsWith: prefix } },
    });
    const seq = String(count + 1).padStart(4, '0');
    return `${prefix}${seq}`;
  }

  async createInvoice(user: AuthUser, dto: CreateInvoiceDto) {
    const subtotal = dto.items.reduce((sum, item) => sum + item.amount, 0);
    const discount = dto.discount ?? 0;
    const total = subtotal - discount;
    const invoiceNumber = await this.generateInvoiceNumber();

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        branchId: dto.branchId,
        childId: dto.childId,
        dueDate: new Date(dto.dueDate),
        subtotal,
        discount,
        total,
        status: InvoiceStatus.ISSUED,
        notes: dto.notes,
        items: {
          create: dto.items.map((item) => ({
            description: item.description,
            amount: item.amount,
            feeStructureId: item.feeStructureId,
          })),
        },
      },
      include: invoiceInclude,
    });
  }

  /** Derive a display status: flags OVERDUE if past due and not fully paid. */
  private deriveStatus(invoice: { status: InvoiceStatus; dueDate: Date; total: Prisma.Decimal; amountPaid: Prisma.Decimal }) {
    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) {
      return invoice.status;
    }
    const isPastDue = new Date(invoice.dueDate).getTime() < Date.now();
    const isFullyPaid = Number(invoice.amountPaid) >= Number(invoice.total);
    if (isPastDue && !isFullyPaid) return InvoiceStatus.OVERDUE;
    return invoice.status;
  }

  async findAllInvoices(
    user: AuthUser,
    query: PaginationQueryDto & { status?: InvoiceStatus; childId?: string },
  ) {
    const { page = 1, pageSize = 20, search, sortBy, sortOrder = 'desc', branchId, status, childId } = query;
    const where: Prisma.InvoiceWhereInput = {
      ...branchScopeWhere(user, branchId),
      ...(status ? { status } : {}),
      ...(childId ? { childId } : {}),
      ...(search
        ? {
            OR: [
              { invoiceNumber: { contains: search, mode: 'insensitive' } },
              { child: { firstName: { contains: search, mode: 'insensitive' } } },
              { child: { lastName: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: invoiceInclude,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: data.map((invoice) => ({ ...invoice, status: this.deriveStatus(invoice) })),
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOneInvoice(user: AuthUser, id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: invoiceInclude,
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    branchScopeWhere(user, invoice.branchId);
    return { ...invoice, status: this.deriveStatus(invoice) };
  }

  async recordPayment(user: AuthUser, invoiceId: string, dto: RecordPaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    branchScopeWhere(user, invoice.branchId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already fully paid');
    }
    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot record payment on a cancelled invoice');
    }

    await this.prisma.payment.create({
      data: {
        invoiceId,
        amount: dto.amount,
        method: dto.method,
        reference: dto.reference,
        notes: dto.notes,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
        recordedById: user.id,
      },
    });

    const payments = await this.prisma.payment.findMany({ where: { invoiceId } });
    const amountPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const total = Number(invoice.total);

    let status: InvoiceStatus = InvoiceStatus.ISSUED;
    if (amountPaid >= total) {
      status = InvoiceStatus.PAID;
    } else if (amountPaid > 0) {
      status = InvoiceStatus.PARTIALLY_PAID;
    }

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { amountPaid, status },
    });

    return this.findOneInvoice(user, invoiceId);
  }

  async outstandingReport(user: AuthUser, branchId?: string) {
    const where: Prisma.InvoiceWhereInput = {
      ...branchScopeWhere(user, branchId),
      status: { notIn: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED] },
    };

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: invoiceInclude,
      orderBy: { dueDate: 'asc' },
    });

    const list = invoices.map((invoice) => ({
      ...invoice,
      status: this.deriveStatus(invoice),
      outstanding: Number(invoice.total) - Number(invoice.amountPaid),
    }));

    const totalOutstanding = list.reduce((sum, inv) => sum + inv.outstanding, 0);

    return { data: list, totalOutstanding, count: list.length };
  }
}
