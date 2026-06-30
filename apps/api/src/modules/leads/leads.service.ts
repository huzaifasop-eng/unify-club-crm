import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadStage, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ChangeLeadStageDto, CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

const leadInclude = {
  branch: true,
  assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
};

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(user: AuthUser, dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        branchId: dto.branchId,
        parentName: dto.parentName,
        parentPhone: dto.parentPhone,
        parentEmail: dto.parentEmail,
        parentAddress: dto.parentAddress,
        childName: dto.childName,
        childDob: dto.childDob ? new Date(dto.childDob) : undefined,
        childGender: dto.childGender,
        diagnosis: dto.diagnosis,
        diagnosisNotes: dto.diagnosisNotes,
        source: dto.source,
        priority: dto.priority,
        assignedToId: dto.assignedToId,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
        notes: dto.notes,
        createdById: user.id,
      },
      include: leadInclude,
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: user.id,
        type: 'created',
        toStage: lead.stage,
        note: 'Lead created',
      },
    });

    return lead;
  }

  async findAll(user: AuthUser, query: PaginationQueryDto & { stage?: LeadStage }) {
    const { page = 1, pageSize = 20, search, sortBy, sortOrder = 'desc', branchId, stage } = query;
    const where: Prisma.LeadWhereInput = {
      ...branchScopeWhere(user, branchId),
      ...(stage ? { stage } : {}),
      ...(search
        ? {
            OR: [
              { parentName: { contains: search, mode: 'insensitive' } },
              { childName: { contains: search, mode: 'insensitive' } },
              { parentPhone: { contains: search, mode: 'insensitive' } },
              { parentEmail: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: leadInclude,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  /** Grouped by stage, for Kanban board rendering. */
  async findKanban(user: AuthUser, branchId?: string) {
    const where = branchScopeWhere(user, branchId);
    const leads = await this.prisma.lead.findMany({
      where,
      include: leadInclude,
      orderBy: { updatedAt: 'desc' },
    });

    const board: Record<string, typeof leads> = {};
    for (const stage of Object.values(LeadStage)) {
      board[stage] = [];
    }
    for (const lead of leads) {
      board[lead.stage].push(lead);
    }
    return board;
  }

  async findOne(user: AuthUser, id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { ...leadInclude, activities: { orderBy: { createdAt: 'desc' } }, calls: true, trials: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    branchScopeWhere(user, lead.branchId);
    return lead;
  }

  async update(user: AuthUser, id: string, dto: UpdateLeadDto) {
    await this.findOne(user, id);
    return this.prisma.lead.update({
      where: { id },
      data: {
        ...dto,
        childDob: dto.childDob ? new Date(dto.childDob) : undefined,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
      },
      include: leadInclude,
    });
  }

  async changeStage(user: AuthUser, id: string, dto: ChangeLeadStageDto) {
    const lead = await this.findOne(user, id);
    const fromStage = lead.stage;

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        stage: dto.stage,
        lostReason: dto.stage === 'LOST' ? dto.lostReason : lead.lostReason,
        isDuplicate: dto.stage === 'DUPLICATE' ? true : lead.isDuplicate,
      },
      include: leadInclude,
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: id,
        userId: user.id,
        type: 'stage_change',
        fromStage,
        toStage: dto.stage,
        note: dto.note,
      },
    });

    return updated;
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    return this.prisma.lead.delete({ where: { id } });
  }

  async pipelineFunnel(user: AuthUser, branchId?: string) {
    const where = branchScopeWhere(user, branchId);
    const counts = await this.prisma.lead.groupBy({
      by: ['stage'],
      where,
      _count: { _all: true },
    });
    return counts.map((c) => ({ stage: c.stage, count: c._count._all }));
  }
}
