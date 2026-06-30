import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Payroll module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.payrollEntry.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  }
}
