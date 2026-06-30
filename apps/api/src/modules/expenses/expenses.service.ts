import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Expenses module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.expense.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  }
}
