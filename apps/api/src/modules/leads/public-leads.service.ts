import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LeadStage } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicLeadDto } from './dto/public-lead.dto';

const FORM_LABELS: Record<CreatePublicLeadDto['formType'], string> = {
  trial: 'Book a Trial',
  contact: 'Contact Form',
  volunteer: 'Volunteer Application',
};

/**
 * Maps the CRM's internal 10-value LeadStage pipeline down to the simple
 * 3-step status shown to the public on the website (book.html, etc). We
 * deliberately do not expose internal stage names (e.g. "FOLLOW_UP") or
 * negative classifications (LOST/DUPLICATE/JUNK) to an unauthenticated
 * visitor — see website/docs/SECURITY.md and ARCHITECTURE.md.
 */
const STEP_BY_STAGE: Record<LeadStage, { step: 1 | 2 | 3; stepLabel: string }> = {
  NEW_LEAD: { step: 1, stepLabel: 'Submitted' },
  CONTACTED: { step: 2, stepLabel: 'Our team is in touch' },
  INTERESTED: { step: 2, stepLabel: 'Our team is in touch' },
  FOLLOW_UP: { step: 2, stepLabel: 'Our team is in touch' },
  TRIAL_BOOKED: { step: 3, stepLabel: 'Session confirmed' },
  TRIAL_COMPLETED: { step: 3, stepLabel: 'Session confirmed' },
  ADMISSION_PENDING: { step: 3, stepLabel: 'Session confirmed' },
  ENROLLED: { step: 3, stepLabel: 'Session confirmed' },
  // Negative/administrative stages still read as "Submitted" publicly —
  // a parent should never see a status that reads as a rejection; staff
  // follow up by phone/email instead. See SECURITY.md §Data Protection.
  LOST: { step: 1, stepLabel: 'Submitted' },
  DUPLICATE: { step: 1, stepLabel: 'Submitted' },
  JUNK: { step: 1, stepLabel: 'Submitted' },
};

/** Very small in-memory sliding-window limiter: 5 submissions / 10 minutes / IP.
 *  Deliberately simple (no new dependency) — see website/docs/SECURITY.md §API Security.
 *  Resets on API restart; acceptable for a low-traffic nonprofit intake form. */
class SlidingWindowLimiter {
  private hits = new Map<string, number[]>();
  constructor(private max: number, private windowMs: number) {}

  check(key: string): boolean {
    const now = Date.now();
    const timestamps = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (timestamps.length >= this.max) {
      this.hits.set(key, timestamps);
      return false;
    }
    timestamps.push(now);
    this.hits.set(key, timestamps);
    return true;
  }
}

@Injectable()
export class PublicLeadsService {
  private limiter = new SlidingWindowLimiter(5, 10 * 60 * 1000);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePublicLeadDto, clientIp: string) {
    if (dto.website) {
      // Honeypot tripped — silently pretend success so the bot doesn't learn.
      return { id: 'ok', step: 1, stepLabel: 'Submitted' };
    }

    if (!this.limiter.check(clientIp)) {
      throw new HttpException(
        'Too many submissions. Please try again later or call/email us directly.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const branchCode = process.env.PUBLIC_INTAKE_BRANCH_CODE || 'NNAZ';
    const branch = await this.prisma.branch.findUnique({ where: { code: branchCode } });
    if (!branch) {
      throw new BadRequestException(
        `No branch configured for public website intake (expected branch code "${branchCode}"). An admin must seed/configure this branch before the website's forms can reach the CRM.`,
      );
    }

    const notes = this.buildNotes(dto);

    const lead = await this.prisma.lead.create({
      data: {
        branchId: branch.id,
        parentName: dto.parentName,
        parentPhone: dto.phone || 'Not provided',
        parentEmail: dto.email,
        childName: dto.childName || dto.parentName,
        source: 'WEBSITE',
        stage: 'NEW_LEAD',
        priority: 'MEDIUM',
        notes,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: null,
        type: 'created',
        toStage: lead.stage,
        note: `Submitted via website — ${FORM_LABELS[dto.formType]}`,
      },
    });

    const status = STEP_BY_STAGE[lead.stage];
    return { id: lead.id, ...status };
  }

  async status(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id }, select: { stage: true } });
    if (!lead) {
      throw new NotFoundException('No submission found for that reference. Double-check the code, or contact us directly.');
    }
    return { id, ...STEP_BY_STAGE[lead.stage] };
  }

  private buildNotes(dto: CreatePublicLeadDto): string {
    const lines = [`[Website — ${FORM_LABELS[dto.formType]}]`];
    if (dto.program) lines.push(`Preferred program: ${dto.program}`);
    if (dto.preferredDay || dto.preferredTime) {
      lines.push(`Preferred time: ${[dto.preferredDay, dto.preferredTime].filter(Boolean).join(' ')}`);
    }
    if (dto.subject) lines.push(`Subject: ${dto.subject}`);
    if (dto.interestArea) lines.push(`Volunteer interest: ${dto.interestArea}`);
    if (dto.availability) lines.push(`Availability: ${dto.availability}`);
    if (dto.message) lines.push(`Message: ${dto.message}`);
    return lines.join('\n');
  }
}
