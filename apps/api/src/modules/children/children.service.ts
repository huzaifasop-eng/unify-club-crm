import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CreateChildDto, CreateProgressNoteDto, UpdateChildDto } from './dto/child.dto';

const childInclude = {
  branch: true,
};

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  create(user: AuthUser, dto: CreateChildDto) {
    return this.prisma.child.create({
      data: {
        branchId: dto.branchId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dob: new Date(dto.dob),
        gender: dto.gender,
        diagnosis: dto.diagnosis,
        diagnosisDate: dto.diagnosisDate ? new Date(dto.diagnosisDate) : undefined,
        strengths: dto.strengths,
        goals: dto.goals,
        medicalConditions: dto.medicalConditions,
        allergies: dto.allergies,
        medications: dto.medications,
        guardianName: dto.guardianName,
        guardianPhone: dto.guardianPhone,
        guardianEmail: dto.guardianEmail,
        guardianAddress: dto.guardianAddress,
        photoUrl: dto.photoUrl,
      },
      include: childInclude,
    });
  }

  async findAll(user: AuthUser, query: PaginationQueryDto) {
    const { page = 1, pageSize = 20, search, sortBy, sortOrder = 'desc', branchId } = query;

    const where: Prisma.ChildWhereInput = {
      ...branchScopeWhere(user, branchId),
      isActive: true,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { guardianName: { contains: search, mode: 'insensitive' } },
              { guardianPhone: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.child.findMany({
        where,
        include: childInclude,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.child.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOne(user: AuthUser, id: string) {
    const child = await this.prisma.child.findUnique({
      where: { id },
      include: {
        ...childInclude,
        progressNotes: { orderBy: { createdAt: 'desc' } },
        admission: true,
        attendances: { orderBy: { date: 'desc' }, take: 30 },
        invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!child) throw new NotFoundException('Child not found');
    branchScopeWhere(user, child.branchId);
    return child;
  }

  async update(user: AuthUser, id: string, dto: UpdateChildDto) {
    await this.findOne(user, id);
    return this.prisma.child.update({
      where: { id },
      data: {
        ...dto,
        dob: dto.dob ? new Date(dto.dob) : undefined,
        diagnosisDate: dto.diagnosisDate ? new Date(dto.diagnosisDate) : undefined,
      },
      include: childInclude,
    });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    return this.prisma.child.update({ where: { id }, data: { isActive: false } });
  }

  async addProgressNote(user: AuthUser, childId: string, dto: CreateProgressNoteDto) {
    await this.findOne(user, childId);
    return this.prisma.progressNote.create({
      data: {
        childId,
        authorId: user.id,
        note: dto.note,
        category: dto.category,
      },
    });
  }

  async getProgressNotes(user: AuthUser, childId: string) {
    await this.findOne(user, childId);
    return this.prisma.progressNote.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
