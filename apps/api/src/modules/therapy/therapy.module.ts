import { Module } from '@nestjs/common';
import { TherapyService } from './therapy.service';
import { TherapyController } from './therapy.controller';

@Module({
  providers: [TherapyService],
  controllers: [TherapyController],
  exports: [TherapyService],
})
export class TherapyModule {}
