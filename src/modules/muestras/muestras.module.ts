import { Module } from '@nestjs/common';
import { MuestrasService } from './muestras.service.js';
import { MuestrasController } from './muestras.controller.js';

@Module({
  controllers: [MuestrasController],
  providers: [MuestrasService],
})
export class MuestrasModule {}
