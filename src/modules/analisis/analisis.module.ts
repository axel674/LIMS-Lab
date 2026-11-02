import { Module } from '@nestjs/common';
import { AnalisisService } from './analisis.service.js';
import { AnalisisController } from './analisis.controller.js';

@Module({
  controllers: [AnalisisController],
  providers: [AnalisisService],
})
export class AnalisisModule {}
