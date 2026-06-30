import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Marketing module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campaign.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  }
}
