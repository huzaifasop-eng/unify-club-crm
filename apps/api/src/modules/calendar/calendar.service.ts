import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Placeholder service for the Calendar module.
 * Schema-only module per project scope — returns a basic list, no business logic yet.
 */
@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.calendarEntry.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  }
}
