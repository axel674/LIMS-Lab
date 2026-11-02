import { Module } from '@nestjs/common';
import { ObrasSocialesService } from './obras-sociales.service.js';
import { ObrasSocialesController } from './obras-sociales.controller.js';

@Module({
  controllers: [ObrasSocialesController],
  providers: [ObrasSocialesService],
})
export class ObrasSocialesModule {}
