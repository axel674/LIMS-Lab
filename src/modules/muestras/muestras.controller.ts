import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MuestrasService } from './muestras.service.js';
import { CreateMuestraDto } from './dto/create-muestra.dto.js';
import { UpdateMuestraDto } from './dto/update-muestra.dto.js';

@Controller('muestras')
export class MuestrasController {
  constructor(private readonly muestrasService: MuestrasService) {}

  @Post()
  create(@Body() createMuestraDto: CreateMuestraDto) {
    return this.muestrasService.create(createMuestraDto);
  }

  @Get()
  findAll() {
    return this.muestrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.muestrasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMuestraDto: UpdateMuestraDto) {
    return this.muestrasService.update(+id, updateMuestraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.muestrasService.remove(+id);
  }
}
