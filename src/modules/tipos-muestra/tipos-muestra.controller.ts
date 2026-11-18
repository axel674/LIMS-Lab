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
import { CreateTipoMuestraDto } from './dto/create-tipo-muestra.dto';
import { UpdateTipoMuestraDto } from './dto/update-tipo-muestra.dto';
import { TiposMuestraService } from './tipos-muestra.service';

@Controller('tipos-muestra')
export class TiposMuestraController {
  constructor(private readonly tiposMuestraService: TiposMuestraService) {}

  @Get()
  listar() {
    return this.tiposMuestraService.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.tiposMuestraService.obtener(id);
  }

  @Post()
  crear(@Body() dto: CreateTipoMuestraDto) {
    return this.tiposMuestraService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoMuestraDto,
  ) {
    return this.tiposMuestraService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.tiposMuestraService.eliminar(id);
  }
}
