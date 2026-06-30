import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TrialsService } from './trials.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Placeholder controller for the Trials module.
 * Full CRUD + business logic is out of scope for this pass; this module
 * exists so the schema, nav entry, and API surface are consistent and
 * ready to be expanded later without breaking links.
 */
@ApiTags('trials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trials')
export class TrialsController {
  constructor(private trialsService: TrialsService) {}

  @Get()
  findAll() {
    return this.trialsService.findAll();
  }
}
