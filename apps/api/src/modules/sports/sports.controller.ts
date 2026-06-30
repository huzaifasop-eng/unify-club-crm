import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SportsService } from './sports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Placeholder controller for the Sports module.
 * Full CRUD + business logic is out of scope for this pass; this module
 * exists so the schema, nav entry, and API surface are consistent and
 * ready to be expanded later without breaking links.
 */
@ApiTags('sports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sports-programs')
export class SportsController {
  constructor(private sportsService: SportsService) {}

  @Get()
  findAll() {
    return this.sportsService.findAll();
  }
}
