import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service.js';
import { MedicosController } from './medicos.controller.js';

@Module({
  controllers: [MedicosController],
  providers: [MedicosService],
})
export class MedicosModule {}
