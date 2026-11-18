import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EstadoOrden } from '../../generated/prisma/client';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { OrdenesService } from './ordenes.service';

@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Get()
  listar(
    @Query('estado') estado?: EstadoOrden,
    @Query('pacienteId') pacienteId?: string,
  ) {
    return this.ordenesService.listar(estado, pacienteId);
  }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordenesService.obtener(id);
  }

  @Post()
  crear(@Body() dto: CreateOrdenDto) {
    return this.ordenesService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrdenDto,
  ) {
    return this.ordenesService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordenesService.eliminar(id);
  }
}
