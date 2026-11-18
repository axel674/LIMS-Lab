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
import { AnalisisService } from './analisis.service';
import { CreateAnalisisDto } from './dto/create-analisis.dto';
import { UpdateAnalisisDto } from './dto/update-analisis.dto';

@Controller('analisis')
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @Get()
  listar() {
    return this.analisisService.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.analisisService.obtener(id);
  }

  @Post()
  crear(@Body() dto: CreateAnalisisDto) {
    return this.analisisService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnalisisDto,
  ) {
    return this.analisisService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.analisisService.eliminar(id);
  }
}
