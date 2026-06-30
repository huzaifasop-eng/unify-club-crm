import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AdmissionStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import {
  ChangeAdmissionStatusDto,
  CreateAdmissionDto,
  UpdateAdmissionDto,
} from './dto/admission.dto';

const admissionInclude = {
  branch: true,
  lead: true,
  documents: true,
};

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  private async generateAdmissionNumber(branchId: string): Promise<string> {
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new NotFoundException('Branch not found');

    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    return this.prisma.$transaction(async (tx) => {
      const count = await tx.admission.count({
        where: {
          branchId,
          createdAt: { gte: startOfYear, lt: endOfYear },
        },
      });

      const sequence = String(count + 1).padStart(4, '0');
      const admissionNumber = `ADM-${branch.code}-${year}-${sequence}`;

      // Guard against a duplicate due to a race condition in a demo app.
      const existing = await tx.admission.findUnique({ where: { admissionNumber } });
      if (existing) {
        const fallbackSequence = String(count + 1 + Math.floor(Math.random() * 1000)).padStart(
          4,
          '0',
        );
        return `ADM-${branch.code}-${year}-${fallbackSequence}`;
      }
      return admissionNumber;
    });
  }

  async create(user: AuthUser, dto: CreateAdmissionDto) {
    const admissionNumber = await this.generateAdmissionNumber(dto.branchId);

    return this.prisma.admission.create({
      data: {
        admissionNumber,
        branchId: dto.branchId,
        leadId: dto.leadId,
        childName: dto.childName,
        childDob: new Date(dto.childDob),
        childGender: dto.childGender,
        guardianName: dto.guardianName,
        guardianRelation: dto.guardianRelation,
        guardianPhone: dto.guardianPhone,
        guardianEmail: dto.guardianEmail,
        guardianCnic: dto.guardianCnic,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
        emergencyRelation: dto.emergencyRelation,
        medicalHistory: dto.medicalHistory,
        diagnosis: dto.diagnosis,
        allergies: dto.allergies,
        medications: dto.medications,
        status: AdmissionStatus.DRAFT,
      },
      include: admissionInclude,
    });
  }

  async findAll(
    user: AuthUser,
    query: PaginationQueryDto & { status?: AdmissionStatus },
  ) {
    const { page = 1, pageSize = 20, search, sortBy, sortOrder = 'desc', branchId, status } =
      query;

    const where: Prisma.AdmissionWhereInput = {
      ...branchScopeWhere(user, branchId),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { childName: { contains: search, mode: 'insensitive' } },
              { guardianName: { contains: search, mode: 'insensitive' } },
              { guardianPhone: { contains: search, mode: 'insensitive' } },
              { admissionNumber: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.admission.findMany({
        where,
        include: admissionInclude,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.admission.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOne(user: AuthUser, id: string) {
    const admission = await this.prisma.admission.findUnique({
      where: { id },
      include: admissionInclude,
    });
    if (!admission) throw new NotFoundException('Admission not found');
    branchScopeWhere(user, admission.branchId);
    return admission;
  }

  async update(user: AuthUser, id: string, dto: UpdateAdmissionDto) {
    await this.findOne(user, id);
    return this.prisma.admission.update({
      where: { id },
      data: {
        ...dto,
        childDob: dto.childDob ? new Date(dto.childDob) : undefined,
      },
      include: admissionInclude,
    });
  }

  async changeStatus(user: AuthUser, id: string, dto: ChangeAdmissionStatusDto) {
    const admission = await this.findOne(user, id);

    if (dto.status === AdmissionStatus.REJECTED && !dto.rejectedReason) {
      throw new BadRequestException('rejectedReason is required when rejecting an admission');
    }

    return this.prisma.$transaction(async (tx) => {
      const data: Prisma.AdmissionUpdateInput = {
        status: dto.status,
      };

      if (dto.status === AdmissionStatus.SUBMITTED) {
        data.submittedAt = new Date();
      }
      if (dto.status === AdmissionStatus.APPROVED) {
        data.approvedAt = new Date();
      }
      if (dto.status === AdmissionStatus.REJECTED) {
        data.rejectedReason = dto.rejectedReason;
      }

      let updated = await tx.admission.update({
        where: { id },
        data,
        include: admissionInclude,
      });

      if (dto.status === AdmissionStatus.ENROLLED && !updated.childId) {
        const nameParts = updated.childName.trim().split(/\s+/);
        const firstName = nameParts[0] ?? updated.childName;
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const child = await tx.child.create({
          data: {
            branchId: updated.branchId,
            firstName,
            lastName,
            dob: updated.childDob,
            gender: updated.childGender,
            diagnosis: updated.diagnosis,
            guardianName: updated.guardianName,
            guardianPhone: updated.guardianPhone,
            guardianEmail: updated.guardianEmail,
          },
        });

        updated = await tx.admission.update({
          where: { id },
          data: { childId: child.id },
          include: admissionInclude,
        });
      }

      return updated;
    });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    return this.prisma.admission.delete({ where: { id } });
  }
}
