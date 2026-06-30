import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Calls module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.call.findMany({ take: 50, orderBy: { calledAt: 'desc' } });
  }
}
