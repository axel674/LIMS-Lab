import { Module } from '@nestjs/common';
import { InformesService } from './informes.service.js';
import { InformesController } from './informes.controller.js';

@Module({
  controllers: [InformesController],
  providers: [InformesService],
})
export class InformesModule {}
