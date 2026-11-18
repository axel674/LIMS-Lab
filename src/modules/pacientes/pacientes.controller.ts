import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacientesService } from './pacientes.service';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  listar() {
    return this.pacientesService.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.obtener(id);
  }

  @Post()
  crear(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePacienteDto,
  ) {
    return this.pacientesService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.eliminar(id);
  }
}
