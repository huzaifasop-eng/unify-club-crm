import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Sports module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class SportsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sportsProgram.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  }
}
