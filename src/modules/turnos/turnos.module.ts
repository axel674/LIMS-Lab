import { Module } from '@nestjs/common';
import { TurnosService } from './turnos.service.js';
import { TurnosController } from './turnos.controller.js';

@Module({
  controllers: [TurnosController],
  providers: [TurnosService],
})
export class TurnosModule {}
