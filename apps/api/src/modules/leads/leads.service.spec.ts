import { ForbiddenException } from '@nestjs/common';
import { LeadStage } from '@prisma/client';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';

describe('LeadsService', () => {
  let leadsService: LeadsService;
  let prisma: {
    lead: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock; count: jest.Mock };
    leadActivity: { create: jest.Mock };
  };

  const branchScopedUser: AuthUser = {
    id: 'user-1',
    email: 'sales.pechs@unifyclub.org',
    firstName: 'Sales',
    lastName: 'Exec',
    roles: ['Sales Executive'],
    permissions: ['leads:create', 'leads:read', 'leads:update'],
    branchIds: ['branch-pechs'],
    isCrossBranch: false,
  };

  const crossBranchUser: AuthUser = {
    ...branchScopedUser,
    id: 'user-2',
    roles: ['Super Admin'],
    branchIds: [],
    isCrossBranch: true,
  };

  const baseLead = {
    id: 'lead-1',
    branchId: 'branch-pechs',
    stage: LeadStage.NEW_LEAD,
    lostReason: null,
    isDuplicate: false,
  };

  beforeEach(() => {
    prisma = {
      lead: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      leadActivity: {
        create: jest.fn(),
      },
    };
    leadsService = new LeadsService(prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('creates a lead in the NEW_LEAD stage and logs a "created" activity', async () => {
      prisma.lead.create.mockResolvedValueOnce({ ...baseLead });
      prisma.leadActivity.create.mockResolvedValueOnce({});

      const dto = {
        branchId: 'branch-pechs',
        parentName: 'Ayesha Khan',
        parentPhone: '03001234567',
        childName: 'Hamza Khan',
      } as any;

      const lead = await leadsService.create(branchScopedUser, dto);

      expect(lead.stage).toBe(LeadStage.NEW_LEAD);
      expect(prisma.lead.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ createdById: branchScopedUser.id, branchId: dto.branchId }),
        }),
      );
      expect(prisma.leadActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            leadId: baseLead.id,
            type: 'created',
            toStage: LeadStage.NEW_LEAD,
          }),
        }),
      );
    });
  });

  describe('findAll branch scoping', () => {
    it('scopes the query to the user\'s own branches when not cross-branch', async () => {
      prisma.lead.findMany.mockResolvedValueOnce([]);
      prisma.lead.count.mockResolvedValueOnce(0);

      await leadsService.findAll(branchScopedUser, {});

      expect(prisma.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ branchId: { in: branchScopedUser.branchIds } }),
        }),
      );
    });

    it('does not restrict by branch for cross-branch roles when no branchId is requested', async () => {
      prisma.lead.findMany.mockResolvedValueOnce([]);
      prisma.lead.count.mockResolvedValueOnce(0);

      await leadsService.findAll(crossBranchUser, {});

      const callArgs = prisma.lead.findMany.mock.calls[0][0];
      expect(callArgs.where.branchId).toBeUndefined();
    });

    it('throws ForbiddenException when a branch-scoped user requests a branch they do not belong to', async () => {
      await expect(
        leadsService.findAll(branchScopedUser, { branchId: 'some-other-branch' } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('changeStage', () => {
    it('moves a lead between pipeline stages and writes a stage_change activity with from/to', async () => {
      prisma.lead.findUnique.mockResolvedValueOnce({ ...baseLead, activities: [], calls: [], trials: [] });
      prisma.lead.update.mockResolvedValueOnce({ ...baseLead, stage: LeadStage.CONTACTED });
      prisma.leadActivity.create.mockResolvedValueOnce({});

      const updated = await leadsService.changeStage(branchScopedUser, baseLead.id, {
        stage: LeadStage.CONTACTED,
      } as any);

      expect(updated.stage).toBe(LeadStage.CONTACTED);
      expect(prisma.leadActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            leadId: baseLead.id,
            type: 'stage_change',
            fromStage: LeadStage.NEW_LEAD,
            toStage: LeadStage.CONTACTED,
          }),
        }),
      );
    });

    it('records the lost reason when a lead transitions to LOST', async () => {
      prisma.lead.findUnique.mockResolvedValueOnce({ ...baseLead, activities: [], calls: [], trials: [] });
      prisma.lead.update.mockResolvedValueOnce({
        ...baseLead,
        stage: LeadStage.LOST,
        lostReason: 'Too expensive',
      });
      prisma.leadActivity.create.mockResolvedValueOnce({});

      const updated = await leadsService.changeStage(branchScopedUser, baseLead.id, {
        stage: LeadStage.LOST,
        lostReason: 'Too expensive',
      } as any);

      expect(updated.stage).toBe(LeadStage.LOST);
      expect(prisma.lead.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ stage: LeadStage.LOST, lostReason: 'Too expensive' }),
        }),
      );
    });
  });
});
