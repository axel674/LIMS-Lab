import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoMuestraDto } from './dto/create-tipo-muestra.dto';
import { UpdateTipoMuestraDto } from './dto/update-tipo-muestra.dto';

@Injectable()
export class TiposMuestraService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.tipoMuestra.findMany({ orderBy: { nombre: 'asc' } });
  }

  async obtener(id: number) {
    const tipo = await this.prisma.tipoMuestra.findUnique({
      where: { id: BigInt(id) },
      include: { analisis: true },
    });

    if (!tipo) {
      throw new NotFoundException(`No existe el tipo de muestra con id ${id}`);
    }

    return tipo;
  }

  async crear(dto: CreateTipoMuestraDto) {
    try {
      return await this.prisma.tipoMuestra.create({
        data: { nombre: dto.nombre, tubo: dto.tubo },
      });
    } catch (error) {
      if (this.esError(error, 'P2002')) {
        throw new ConflictException(
          `Ya existe el tipo de muestra ${dto.nombre}`,
        );
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: UpdateTipoMuestraDto) {
    await this.obtener(id);
    return this.prisma.tipoMuestra.update({
      where: { id: BigInt(id) },
      data: { nombre: dto.nombre, tubo: dto.tubo },
    });
  }

  async eliminar(id: number) {
    await this.obtener(id);

    try {
      await this.prisma.tipoMuestra.delete({ where: { id: BigInt(id) } });
      return { eliminado: true, id };
    } catch (error) {
      if (this.esError(error, 'P2003')) {
        throw new ConflictException(
          'Hay analisis que usan este tipo de muestra: no se puede eliminar',
        );
      }
      throw error;
    }
  }

  private esError(error: unknown, codigo: string) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === codigo
    );
  }
}
