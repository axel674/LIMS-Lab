import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObrasSocialesService } from './obras-sociales.service.js';
import { CreateObrasSocialeDto } from './dto/create-obras-sociale.dto.js';
import { UpdateObrasSocialeDto } from './dto/update-obras-sociale.dto.js';

@Controller('obras-sociales')
export class ObrasSocialesController {
  constructor(private readonly obrasSocialesService: ObrasSocialesService) {}

  @Post()
  create(@Body() createObrasSocialeDto: CreateObrasSocialeDto) {
    return this.obrasSocialesService.create(createObrasSocialeDto);
  }

  @Get()
  findAll() {
    return this.obrasSocialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.obrasSocialesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateObrasSocialeDto: UpdateObrasSocialeDto) {
    return this.obrasSocialesService.update(+id, updateObrasSocialeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.obrasSocialesService.remove(+id);
  }
}
