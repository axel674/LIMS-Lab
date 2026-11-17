import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateObraSocialDto } from './dto/create-obra-social.dto';
import { UpdateObraSocialDto } from './dto/update-obra-social.dto';
import { ObrasSocialesService } from './obras-sociales.service';

@Controller('obras-sociales')
export class ObrasSocialesController {
  constructor(private readonly obrasSocialesService: ObrasSocialesService) {}

  @Get()
  listar() {
    return this.obrasSocialesService.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.obrasSocialesService.obtener(id);
  }

  @Post()
  crear(@Body() dto: CreateObraSocialDto) {
    return this.obrasSocialesService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateObraSocialDto,
  ) {
    return this.obrasSocialesService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.obrasSocialesService.eliminar(id);
  }
}
