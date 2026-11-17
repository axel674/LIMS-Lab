import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoOrden } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';

const INCLUDE_ORDEN = {
  paciente: { include: { obraSocial: true } },
  obraSocial: true,
  items: { include: { analisis: { include: { tipoMuestra: true } } } },
} as const;

@Injectable()
export class OrdenesService {
  constructor(private readonly prisma: PrismaService) {}

  listar(estado?: EstadoOrden, pacienteId?: string) {
    return this.prisma.orden.findMany({
      where: {
        estado: estado || undefined,
        pacienteId: pacienteId || undefined,
      },
      include: INCLUDE_ORDEN,
      orderBy: { fechaRecepcion: 'desc' },
    });
  }

  async obtener(id: string) {
    const orden = await this.prisma.orden.findUnique({
      where: { id },
      include: INCLUDE_ORDEN,
    });

    if (!orden) {
      throw new NotFoundException(`No existe la orden con id ${id}`);
    }

    return orden;
  }

  async crear(dto: CreateOrdenDto) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: dto.pacienteId },
    });

    if (!paciente) {
      throw new NotFoundException(
        `No existe el paciente con id ${dto.pacienteId}`,
      );
    }

    const ids = [...new Set(dto.analisisIds)];
    const analisis = await this.prisma.analisis.findMany({
      where: { id: { in: ids.map((id) => BigInt(id)) } },
    });

    if (analisis.length !== ids.length) {
      throw new BadRequestException(
        'Alguno de los analisis indicados no existe',
      );
    }

    // Sin obra social explicita se usa la del paciente; sin obra social no hay
    // cobertura y todos los estudios quedan como particulares.
    const obraSocialId = dto.obraSocialId ?? paciente.obraSocialId ?? null;
    const cubierto = obraSocialId !== null;
    const nroOrden = await this.generarNroOrden();

    return this.prisma.orden.create({
      data: {
        nroOrden,
        pacienteId: dto.pacienteId,
        obraSocialId: obraSocialId === null ? null : BigInt(obraSocialId),
        fechaOrden: dto.fechaOrden ? new Date(dto.fechaOrden) : new Date(),
        observaciones: dto.observaciones,
        items: {
          create: analisis.map((item) => ({
            analisisId: item.id,
            cubierto,
            ub: item.ub,
          })),
        },
      },
      include: INCLUDE_ORDEN,
    });
  }

  async actualizar(id: string, dto: UpdateOrdenDto) {
    await this.obtener(id);

    if (dto.analisisIds !== undefined && dto.analisisIds.length === 0) {
      throw new BadRequestException('La orden necesita al menos un analisis');
    }

    if (dto.analisisIds) {
      const ids = [...new Set(dto.analisisIds)];
      const analisis = await this.prisma.analisis.findMany({
        where: { id: { in: ids.map((valor) => BigInt(valor)) } },
      });

      if (analisis.length !== ids.length) {
        throw new BadRequestException(
          'Alguno de los analisis indicados no existe',
        );
      }

      await this.prisma.ordenAnalisis.deleteMany({ where: { ordenId: id } });
      await this.prisma.ordenAnalisis.createMany({
        data: analisis.map((item) => ({
          ordenId: id,
          analisisId: item.id,
          cubierto: true,
          ub: item.ub,
        })),
      });
    }

    const anulada = dto.estado === EstadoOrden.anulada;

    return this.prisma.orden.update({
      where: { id },
      data: {
        obraSocialId:
          dto.obraSocialId === undefined
            ? undefined
            : dto.obraSocialId === null
              ? null
              : BigInt(dto.obraSocialId),
        fechaOrden: dto.fechaOrden ? new Date(dto.fechaOrden) : undefined,
        observaciones: dto.observaciones,
        estado: dto.estado,
        motivoAnulacion: dto.motivoAnulacion,
        anuladaEn: anulada ? new Date() : undefined,
      },
      include: INCLUDE_ORDEN,
    });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    await this.prisma.orden.delete({ where: { id } });
    return { eliminado: true, id };
  }

  /**
   * Numero correlativo por anio, con el mismo formato que usa el LIMS
   * (S1-2026-000123), pero sin sucursal porque el TP no replica esa tabla.
   */
  private async generarNroOrden() {
    const anio = new Date().getFullYear();
    const prefijo = `ORD-${anio}-`;
    const cantidad = await this.prisma.orden.count({
      where: { nroOrden: { startsWith: prefijo } },
    });

    return `${prefijo}${String(cantidad + 1).padStart(6, '0')}`;
  }
}
