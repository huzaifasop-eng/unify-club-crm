import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { PublicLeadsService } from './public-leads.service';
import { PublicLeadsController } from './public-leads.controller';

@Module({
  providers: [LeadsService, PublicLeadsService],
  controllers: [LeadsController, PublicLeadsController],
  exports: [LeadsService],
})
export class LeadsModule {}
