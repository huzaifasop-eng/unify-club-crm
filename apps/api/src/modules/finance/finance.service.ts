import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Finance module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ledgerEntry.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  }
}
