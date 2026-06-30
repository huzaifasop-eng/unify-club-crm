import { BadRequestException, Injectable } from '@nestjs/common';
import { AttendanceStatus, AttendeeType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';
import {
  BulkAttendanceRecordDto,
  BulkMarkAttendanceDto,
  MarkAttendanceDto,
} from './dto/attendance.dto';

const attendanceInclude = {
  child: { select: { id: true, firstName: true, lastName: true } },
  staff: {
    select: {
      id: true,
      employeeCode: true,
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  },
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private validateAttendeeConsistency(
    attendeeType: AttendeeType,
    childId?: string | null,
    staffId?: string | null,
  ) {
    if (attendeeType === AttendeeType.CHILD) {
      if (!childId || staffId) {
        throw new BadRequestException('childId is required and staffId must be omitted when attendeeType is CHILD');
      }
    } else if (attendeeType === AttendeeType.STAFF) {
      if (!staffId || childId) {
        throw new BadRequestException('staffId is required and childId must be omitted when attendeeType is STAFF');
      }
    }
  }

  /** Find existing attendance row for this person+date, or create one. */
  private async upsertAttendance(
    user: AuthUser,
    params: {
      branchId: string;
      attendeeType: AttendeeType;
      childId?: string | null;
      staffId?: string | null;
      date: Date;
      status: AttendanceStatus;
      checkInTime?: Date;
      checkOutTime?: Date;
      notes?: string;
    },
  ) {
    this.validateAttendeeConsistency(params.attendeeType, params.childId, params.staffId);

    const dayStart = startOfDay(params.date);
    const dayEnd = endOfDay(params.date);

    const where: Prisma.AttendanceWhereInput = {
      branchId: params.branchId,
      attendeeType: params.attendeeType,
      date: { gte: dayStart, lte: dayEnd },
      ...(params.childId ? { childId: params.childId } : {}),
      ...(params.staffId ? { staffId: params.staffId } : {}),
    };

    const existing = await this.prisma.attendance.findFirst({ where });

    const data = {
      branchId: params.branchId,
      attendeeType: params.attendeeType,
      childId: params.childId ?? null,
      staffId: params.staffId ?? null,
      date: dayStart,
      status: params.status,
      checkInTime: params.checkInTime,
      checkOutTime: params.checkOutTime,
      notes: params.notes,
      markedById: user.id,
    };

    if (existing) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data,
        include: attendanceInclude,
      });
    }

    return this.prisma.attendance.create({
      data,
      include: attendanceInclude,
    });
  }

  async markAttendance(user: AuthUser, dto: MarkAttendanceDto) {
    branchScopeWhere(user, dto.branchId);
    return this.upsertAttendance(user, {
      branchId: dto.branchId,
      attendeeType: dto.attendeeType,
      childId: dto.childId,
      staffId: dto.staffId,
      date: new Date(dto.date),
      status: dto.status,
      checkInTime: dto.checkInTime ? new Date(dto.checkInTime) : undefined,
      checkOutTime: dto.checkOutTime ? new Date(dto.checkOutTime) : undefined,
      notes: dto.notes,
    });
  }

  async bulkMark(user: AuthUser, dto: BulkMarkAttendanceDto) {
    branchScopeWhere(user, dto.branchId);
    const date = new Date(dto.date);

    return this.prisma.$transaction(async (tx) => {
      const results: Prisma.AttendanceGetPayload<Record<string, never>>[] = [];
      for (const record of dto.records as BulkAttendanceRecordDto[]) {
        this.validateAttendeeConsistency(dto.attendeeType, record.childId, record.staffId);

        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        const where: Prisma.AttendanceWhereInput = {
          branchId: dto.branchId,
          attendeeType: dto.attendeeType,
          date: { gte: dayStart, lte: dayEnd },
          ...(record.childId ? { childId: record.childId } : {}),
          ...(record.staffId ? { staffId: record.staffId } : {}),
        };

        const existing = await tx.attendance.findFirst({ where });
        const data = {
          branchId: dto.branchId,
          attendeeType: dto.attendeeType,
          childId: record.childId ?? null,
          staffId: record.staffId ?? null,
          date: dayStart,
          status: record.status,
          notes: record.notes,
          markedById: user.id,
        };

        const row = existing
          ? await tx.attendance.update({ where: { id: existing.id }, data })
          : await tx.attendance.create({ data });

        results.push(row);
      }
      return results;
    });
  }

  async findByDate(user: AuthUser, branchId: string | undefined, date: string, attendeeType?: AttendeeType) {
    const day = new Date(date);
    const where: Prisma.AttendanceWhereInput = {
      ...branchScopeWhere(user, branchId),
      date: { gte: startOfDay(day), lte: endOfDay(day) },
      ...(attendeeType ? { attendeeType } : {}),
    };

    return this.prisma.attendance.findMany({
      where,
      include: attendanceInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMonthly(
    user: AuthUser,
    branchId: string | undefined,
    year: number,
    month: number,
    attendeeType?: AttendeeType,
    childId?: string,
    staffId?: string,
  ) {
    const rangeStart = new Date(year, month - 1, 1);
    const rangeEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const where: Prisma.AttendanceWhereInput = {
      ...branchScopeWhere(user, branchId),
      date: { gte: rangeStart, lte: rangeEnd },
      ...(attendeeType ? { attendeeType } : {}),
      ...(childId ? { childId } : {}),
      ...(staffId ? { staffId } : {}),
    };

    return this.prisma.attendance.findMany({
      where,
      include: attendanceInclude,
      orderBy: { date: 'asc' },
    });
  }

  async getAttendanceStats(user: AuthUser, branchId?: string, date?: string) {
    const day = date ? new Date(date) : new Date();
    const where: Prisma.AttendanceWhereInput = {
      ...branchScopeWhere(user, branchId),
      attendeeType: AttendeeType.CHILD,
      date: { gte: startOfDay(day), lte: endOfDay(day) },
    };

    const records = await this.prisma.attendance.findMany({ where, select: { status: true } });

    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const late = records.filter((r) => r.status === AttendanceStatus.LATE).length;
    const total = records.length;
    const percentPresent = total > 0 ? Math.round((present / total) * 10000) / 100 : 0;

    return {
      date: startOfDay(day).toISOString().slice(0, 10),
      present,
      absent,
      late,
      total,
      percentPresent,
    };
  }
}
