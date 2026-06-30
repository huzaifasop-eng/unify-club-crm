import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { branchScopeWhere } from '../../common/utils/branch-scope.util';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async revenueReport(user: AuthUser, branchId?: string, months = 12) {
    const where = branchScopeWhere(user, branchId);
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const payments = await this.prisma.payment.findMany({
      where: { paidAt: { gte: since }, invoice: { is: where } },
      select: { paidAt: true, amount: true, method: true },
    });

    const byMonth: Record<string, number> = {};
    const byMethod: Record<string, number> = {};
    let total = 0;
    for (const p of payments) {
      const monthKey = `${p.paidAt.getFullYear()}-${String(p.paidAt.getMonth() + 1).padStart(2, '0')}`;
      byMonth[monthKey] = (byMonth[monthKey] ?? 0) + Number(p.amount);
      byMethod[p.method] = (byMethod[p.method] ?? 0) + Number(p.amount);
      total += Number(p.amount);
    }

    return {
      total,
      byMonth: Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue })).sort((a, b) => a.month.localeCompare(b.month)),
      byMethod: Object.entries(byMethod).map(([method, amount]) => ({ method, amount })),
    };
  }

  async feeCollectionReport(user: AuthUser, branchId?: string) {
    const where = branchScopeWhere(user, branchId);
    const invoices = await this.prisma.invoice.findMany({
      where,
      select: { total: true, amountPaid: true, status: true, child: { select: { firstName: true, lastName: true } } },
    });

    let totalBilled = 0;
    let totalCollected = 0;
    const statusCounts: Record<string, number> = {};

    for (const inv of invoices) {
      totalBilled += Number(inv.total);
      totalCollected += Number(inv.amountPaid);
      statusCounts[inv.status] = (statusCounts[inv.status] ?? 0) + 1;
    }

    return {
      totalBilled,
      totalCollected,
      totalOutstanding: Math.max(totalBilled - totalCollected, 0),
      collectionRate: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0,
      statusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    };
  }

  async admissionsTrendReport(user: AuthUser, branchId?: string, months = 12) {
    const where = branchScopeWhere(user, branchId);
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const admissions = await this.prisma.admission.findMany({
      where: { ...where, createdAt: { gte: since } },
      select: { createdAt: true, status: true },
    });

    const byMonth: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    for (const a of admissions) {
      const monthKey = `${a.createdAt.getFullYear()}-${String(a.createdAt.getMonth() + 1).padStart(2, '0')}`;
      byMonth[monthKey] = (byMonth[monthKey] ?? 0) + 1;
      byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
    }

    return {
      total: admissions.length,
      byMonth: Object.entries(byMonth).map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month)),
      byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    };
  }

  async leadConversionFunnel(user: AuthUser, branchId?: string) {
    const where = branchScopeWhere(user, branchId);
    const counts = await this.prisma.lead.groupBy({
      by: ['stage'],
      where,
      _count: { _all: true },
    });

    const stageOrder = [
      'NEW_LEAD',
      'CONTACTED',
      'INTERESTED',
      'FOLLOW_UP',
      'TRIAL_BOOKED',
      'TRIAL_COMPLETED',
      'ADMISSION_PENDING',
      'ENROLLED',
      'LOST',
      'DUPLICATE',
      'JUNK',
    ];

    const map = new Map(counts.map((c) => [c.stage, c._count._all]));
    const funnel = stageOrder.map((stage) => ({ stage, count: map.get(stage as any) ?? 0 }));

    const total = funnel.reduce((sum, f) => sum + f.count, 0);
    const enrolled = map.get('ENROLLED' as any) ?? 0;
    const conversionRate = total > 0 ? Math.round((enrolled / total) * 100) : 0;

    return { funnel, total, enrolled, conversionRate };
  }
}
