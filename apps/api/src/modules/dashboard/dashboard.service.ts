import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis(user: AuthUser, branchId?: string) {
    const leadWhere = branchScopeWhere(user, branchId);
    const today = startOfDay();
    const todayEnd = endOfDay();
    const monthStart = startOfMonth();

    const [
      admissionsToday,
      totalLeads,
      newLeadsThisMonth,
      enrolledThisMonth,
      childrenActive,
      feesOutstandingAgg,
      revenueThisMonthAgg,
      attendanceToday,
      childrenTotalActive,
      pendingLeaveRequests,
    ] = await Promise.all([
      this.prisma.admission.count({
        where: { ...leadWhere, createdAt: { gte: today, lte: todayEnd } },
      }),
      this.prisma.lead.count({ where: leadWhere }),
      this.prisma.lead.count({ where: { ...leadWhere, createdAt: { gte: monthStart } } }),
      this.prisma.lead.count({
        where: { ...leadWhere, stage: 'ENROLLED', updatedAt: { gte: monthStart } },
      }),
      this.prisma.child.count({ where: { ...leadWhere, isActive: true } }),
      this.prisma.invoice.aggregate({
        where: { ...leadWhere, status: { in: ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] } },
        _sum: { total: true, amountPaid: true },
      }),
      this.prisma.payment.aggregate({
        where: { paidAt: { gte: monthStart }, invoice: { is: leadWhere } },
        _sum: { amount: true },
      }),
      this.prisma.attendance.findMany({
        where: { ...leadWhere, attendeeType: 'CHILD', date: { gte: today, lte: todayEnd } },
        select: { status: true },
      }),
      this.prisma.child.count({ where: { ...leadWhere, isActive: true } }),
      this.prisma.leaveRequest.count({
        where: { status: 'PENDING', staff: leadWhere },
      }),
    ]);

    const presentCount = attendanceToday.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendancePercent = attendanceToday.length > 0
      ? Math.round((presentCount / attendanceToday.length) * 100)
      : 0;

    const totalDue = Number(feesOutstandingAgg._sum.total ?? 0);
    const totalPaid = Number(feesOutstandingAgg._sum.amountPaid ?? 0);
    const feesPending = Math.max(totalDue - totalPaid, 0);

    return {
      admissionsToday,
      totalLeads,
      newLeadsThisMonth,
      enrolledThisMonth,
      childrenActive,
      childrenTotalActive,
      feesPending,
      revenueThisMonth: Number(revenueThisMonthAgg._sum.amount ?? 0),
      attendanceTodayPercent: attendancePercent,
      attendanceTodayMarked: attendanceToday.length,
      pendingLeaveRequests,
    };
  }

  async getLeadTrend(user: AuthUser, branchId?: string, days = 30) {
    const where = branchScopeWhere(user, branchId);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const leads = await this.prisma.lead.findMany({
      where: { ...where, createdAt: { gte: since } },
      select: { createdAt: true },
    });

    const buckets: Record<string, number> = {};
    for (const lead of leads) {
      const key = lead.createdAt.toISOString().slice(0, 10);
      buckets[key] = (buckets[key] ?? 0) + 1;
    }
    return Object.entries(buckets)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getRevenueTrend(user: AuthUser, branchId?: string, months = 6) {
    const where = branchScopeWhere(user, branchId);
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const payments = await this.prisma.payment.findMany({
      where: { paidAt: { gte: since }, invoice: { is: where } },
      select: { paidAt: true, amount: true },
    });

    const buckets: Record<string, number> = {};
    for (const p of payments) {
      const key = `${p.paidAt.getFullYear()}-${String(p.paidAt.getMonth() + 1).padStart(2, '0')}`;
      buckets[key] = (buckets[key] ?? 0) + Number(p.amount);
    }
    return Object.entries(buckets)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  async getRecentActivity(user: AuthUser, branchId?: string, take = 10) {
    const where = branchScopeWhere(user, branchId);
    const [recentLeads, recentAdmissions, recentPayments] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        select: { id: true, parentName: true, childName: true, stage: true, createdAt: true },
      }),
      this.prisma.admission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        select: { id: true, admissionNumber: true, childName: true, status: true, createdAt: true },
      }),
      this.prisma.payment.findMany({
        where: { invoice: { is: where } },
        orderBy: { createdAt: 'desc' },
        take,
        select: { id: true, amount: true, method: true, createdAt: true, invoice: { select: { invoiceNumber: true } } },
      }),
    ]);
    return { recentLeads, recentAdmissions, recentPayments };
  }
}
