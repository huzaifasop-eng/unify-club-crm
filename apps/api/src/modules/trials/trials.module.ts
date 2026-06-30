import { Module } from '@nestjs/common';
import { TrialsService } from './trials.service';
import { TrialsController } from './trials.controller';

@Module({
  providers: [TrialsService],
  controllers: [TrialsController],
  exports: [TrialsService],
})
export class TrialsModule {}
