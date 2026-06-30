import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TherapyService } from './therapy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Placeholder controller for the Therapy module.
 * Full CRUD + business logic is out of scope for this pass; this module
 * exists so the schema, nav entry, and API surface are consistent and
 * ready to be expanded later without breaking links.
 */
@ApiTags('therapy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('therapy-programs')
export class TherapyController {
  constructor(private therapyService: TherapyService) {}

  @Get()
  findAll() {
    return this.therapyService.findAll();
  }
}
