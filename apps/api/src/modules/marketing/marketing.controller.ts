import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Placeholder controller for the Marketing module.
 * Full CRUD + business logic is out of scope for this pass; this module
 * exists so the schema, nav entry, and API surface are consistent and
 * ready to be expanded later without breaking links.
 */
@ApiTags('marketing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing/campaigns')
export class MarketingController {
  constructor(private marketingService: MarketingService) {}

  @Get()
  findAll() {
    return this.marketingService.findAll();
  }
}
