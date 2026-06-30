import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Documents module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.document.findMany({ take: 50, orderBy: { uploadedAt: 'desc' } });
  }
}
