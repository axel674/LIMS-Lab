import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalisisDto } from './dto/create-analisis.dto';
import { UpdateAnalisisDto } from './dto/update-analisis.dto';

@Injectable()
export class AnalisisService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.analisis.findMany({
      include: { tipoMuestra: true },
      orderBy: { codigo: 'asc' },
    });
  }

  async obtener(id: number) {
    const analisis = await this.prisma.analisis.findUnique({
      where: { id: BigInt(id) },
      include: { tipoMuestra: true },
    });

    if (!analisis) {
      throw new NotFoundException(`No existe el analisis con id ${id}`);
    }

    return analisis;
  }

  async crear(dto: CreateAnalisisDto) {
    await this.verificarTipoMuestra(dto.tipoMuestraId);

    try {
      return await this.prisma.analisis.create({
        data: {
          codigo: dto.codigo,
          nombre: dto.nombre,
          tipoMuestraId: BigInt(dto.tipoMuestraId),
          unidad: dto.unidad,
          valorRefMin: dto.valorRefMin,
          valorRefMax: dto.valorRefMax,
          valorRefTexto: dto.valorRefTexto,
          diasDemora: dto.diasDemora,
          activo: dto.activo ?? true,
          ub: dto.ub,
          codigoNbu: dto.codigoNbu,
        },
        include: { tipoMuestra: true },
      });
    } catch (error) {
      if (this.esError(error, 'P2002')) {
        throw new ConflictException(
          `Ya existe un analisis con el codigo ${dto.codigo}`,
        );
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: UpdateAnalisisDto) {
    await this.obtener(id);
    await this.verificarTipoMuestra(dto.tipoMuestraId);

    try {
      return await this.prisma.analisis.update({
        where: { id: BigInt(id) },
        data: {
          codigo: dto.codigo,
          nombre: dto.nombre,
          tipoMuestraId:
            dto.tipoMuestraId === undefined
              ? undefined
              : BigInt(dto.tipoMuestraId),
          unidad: dto.unidad,
          valorRefMin: dto.valorRefMin,
          valorRefMax: dto.valorRefMax,
          valorRefTexto: dto.valorRefTexto,
          diasDemora: dto.diasDemora,
          activo: dto.activo,
          ub: dto.ub,
          codigoNbu: dto.codigoNbu,
        },
        include: { tipoMuestra: true },
      });
    } catch (error) {
      if (this.esError(error, 'P2002')) {
        throw new ConflictException(
          `Ya existe un analisis con el codigo ${dto.codigo}`,
        );
      }
      throw error;
    }
  }

  async eliminar(id: number) {
    await this.obtener(id);

    try {
      await this.prisma.analisis.delete({ where: { id: BigInt(id) } });
      return { eliminado: true, id };
    } catch (error) {
      if (this.esError(error, 'P2003')) {
        throw new ConflictException(
          'El analisis esta incluido en ordenes: conviene desactivarlo en lugar de eliminarlo',
        );
      }
      throw error;
    }
  }

  private async verificarTipoMuestra(tipoMuestraId?: number) {
    if (tipoMuestraId === undefined || tipoMuestraId === null) {
      return;
    }

    const existe = await this.prisma.tipoMuestra.findUnique({
      where: { id: BigInt(tipoMuestraId) },
    });

    if (!existe) {
      throw new NotFoundException(
        `No existe el tipo de muestra con id ${tipoMuestraId}`,
      );
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
