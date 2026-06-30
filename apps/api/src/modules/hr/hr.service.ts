import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { EmploymentStatus, LeaveStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import {
  CreateLeaveRequestDto,
  CreateStaffDto,
  UpdateLeaveStatusDto,
  UpdateStaffDto,
} from './dto/hr.dto';

const staffUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  avatarUrl: true,
};

const staffInclude = {
  user: { select: staffUserSelect },
};

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  async createStaff(dto: CreateStaffDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          isActive: true,
        },
      });

      const staff = await tx.staff.create({
        data: {
          userId: user.id,
          branchId: dto.branchId,
          employeeCode: dto.employeeCode,
          designation: dto.designation,
          department: dto.department,
          joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
          salary: dto.salary,
          cnic: dto.cnic,
          address: dto.address,
        },
        include: staffInclude,
      });

      return staff;
    });
  }

  async findAllStaff(
    user: AuthUser,
    query: PaginationQueryDto & { department?: string; status?: EmploymentStatus },
  ) {
    const { page = 1, pageSize = 20, search, sortBy, sortOrder = 'desc', branchId, department, status } =
      query;

    const where: Prisma.StaffWhereInput = {
      ...branchScopeWhere(user, branchId),
      ...(department ? { department } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { employeeCode: { contains: search, mode: 'insensitive' } },
              { user: { firstName: { contains: search, mode: 'insensitive' } } },
              { user: { lastName: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        include: staffInclude,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.staff.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOneStaff(user: AuthUser, id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        user: { select: staffUserSelect },
        branch: true,
        leaveRequests: { orderBy: { createdAt: 'desc' }, take: 10 },
        attendances: { orderBy: { date: 'desc' }, take: 30 },
      },
    });
    if (!staff) throw new NotFoundException('Staff not found');
    branchScopeWhere(user, staff.branchId);
    return staff;
  }

  async updateStaff(user: AuthUser, id: string, dto: UpdateStaffDto) {
    await this.findOneStaff(user, id);
    return this.prisma.staff.update({
      where: { id },
      data: {
        designation: dto.designation,
        department: dto.department,
        status: dto.status,
        salary: dto.salary,
        address: dto.address,
        joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
      },
      include: staffInclude,
    });
  }

  async removeStaff(user: AuthUser, id: string) {
    await this.findOneStaff(user, id);
    return this.prisma.staff.update({
      where: { id },
      data: { status: EmploymentStatus.TERMINATED },
      include: staffInclude,
    });
  }

  async createLeaveRequest(user: AuthUser, dto: CreateLeaveRequestDto) {
    return this.prisma.leaveRequest.create({
      data: {
        staffId: dto.staffId,
        type: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        status: LeaveStatus.PENDING,
      },
      include: { staff: { include: staffInclude } },
    });
  }

  async findLeaveRequests(
    user: AuthUser,
    query: PaginationQueryDto & { staffId?: string; status?: LeaveStatus },
  ) {
    const { page = 1, pageSize = 20, sortBy, sortOrder = 'desc', branchId, staffId, status } = query;

    const where: Prisma.LeaveRequestWhereInput = {
      staff: branchScopeWhere(user, branchId),
      ...(staffId ? { staffId } : {}),
      ...(status ? { status } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where,
        include: { staff: { include: staffInclude } },
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async updateLeaveStatus(user: AuthUser, id: string, dto: UpdateLeaveStatusDto) {
    const leave = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!leave) throw new NotFoundException('Leave request not found');

    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: dto.status,
        approvedById: dto.status === LeaveStatus.APPROVED ? user.id : leave.approvedById,
      },
      include: { staff: { include: staffInclude } },
    });
  }
}
