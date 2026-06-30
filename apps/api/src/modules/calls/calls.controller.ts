import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Placeholder controller for the Calls module.
 * Full CRUD + business logic is out of scope for this pass; this module
 * exists so the schema, nav entry, and API surface are consistent and
 * ready to be expanded later without breaking links.
 */
@ApiTags('calls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Get()
  findAll() {
    return this.callsService.findAll();
  }
}
