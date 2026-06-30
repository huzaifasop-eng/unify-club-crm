import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Placeholder controller for the Events module.
 * Full CRUD + business logic is out of scope for this pass; this module
 * exists so the schema, nav entry, and API surface are consistent and
 * ready to be expanded later without breaking links.
 */
@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }
}
