import { Body, Controller, Get, Ip, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicLeadsService } from './public-leads.service';
import { CreatePublicLeadDto } from './dto/public-lead.dto';

/**
 * Deliberately separate from LeadsController: everything here is reachable
 * without authentication, because it's called from the public marketing
 * website (website/book.html, contact.html, get-involved.html), which has
 * no logged-in user. No route in this controller may require a staff
 * permission or expose data beyond the simplified 3-step status in
 * PublicLeadsService. See website/docs/SECURITY.md §API Security.
 */
@ApiTags('public-leads')
@Controller('public/leads')
export class PublicLeadsController {
  constructor(private publicLeadsService: PublicLeadsService) {}

  @Post()
  create(@Body() dto: CreatePublicLeadDto, @Ip() ip: string) {
    return this.publicLeadsService.create(dto, ip);
  }

  @Get(':id/status')
  status(@Param('id') id: string) {
    return this.publicLeadsService.status(id);
  }
}
