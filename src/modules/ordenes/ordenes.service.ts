import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoOrden, Prisma } from '../../generated/prisma/client';
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
    const orden = await this.obtener(id);

    if (dto.analisisIds !== undefined && dto.analisisIds.length === 0) {
      throw new BadRequestException('La orden necesita al menos un analisis');
    }

    // Los analisis nuevos se validan antes de tocar nada
    let analisis: { id: bigint; ub: Prisma.Decimal | null }[] | null = null;
    if (dto.analisisIds) {
      const ids = [...new Set(dto.analisisIds)];
      analisis = await this.prisma.analisis.findMany({
        where: { id: { in: ids.map((valor) => BigInt(valor)) } },
        select: { id: true, ub: true },
      });

      if (analisis.length !== ids.length) {
        throw new BadRequestException(
          'Alguno de los analisis indicados no existe',
        );
      }
    }

    // Misma regla que al crear: con obra social los estudios quedan cubiertos,
    // sin obra social son particulares
    const obraSocialId =
      dto.obraSocialId === undefined
        ? orden.obraSocialId
        : dto.obraSocialId === null
          ? null
          : BigInt(dto.obraSocialId);
    const cubierto = obraSocialId !== null;
    const anulada = dto.estado === EstadoOrden.anulada;

    // Todo en una transaccion: si algo falla, la orden queda como estaba
    // (antes podia quedar sin estudios si fallaba la carga de los nuevos)
    return this.prisma.$transaction(async (tx) => {
      if (analisis) {
        await tx.ordenAnalisis.deleteMany({ where: { ordenId: id } });
        await tx.ordenAnalisis.createMany({
          data: analisis.map((item) => ({
            ordenId: id,
            analisisId: item.id,
            cubierto,
            ub: item.ub,
          })),
        });
      } else if (dto.obraSocialId !== undefined) {
        // Cambio la obra social sin cambiar los estudios: se actualiza su cobertura
        await tx.ordenAnalisis.updateMany({
          where: { ordenId: id },
          data: { cubierto },
        });
      }

      return tx.orden.update({
        where: { id },
        data: {
          obraSocialId: dto.obraSocialId === undefined ? undefined : obraSocialId,
          fechaOrden: dto.fechaOrden ? new Date(dto.fechaOrden) : undefined,
          observaciones: dto.observaciones,
          estado: dto.estado,
          motivoAnulacion: dto.motivoAnulacion,
          anuladaEn: anulada ? new Date() : undefined,
        },
        include: INCLUDE_ORDEN,
      });
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
   *
   * Se parte del numero mas alto del anio y no de la cantidad de ordenes:
   * si se borra una orden, contar daria un numero que ya existe y la base
   * rechazaria la orden nueva (nro_orden es unico).
   */
  private async generarNroOrden() {
    const anio = new Date().getFullYear();
    const prefijo = `ORD-${anio}-`;
    // El correlativo tiene 6 digitos con ceros a la izquierda, asi que el
    // orden alfabetico coincide con el numerico
    const ultima = await this.prisma.orden.findFirst({
      where: { nroOrden: { startsWith: prefijo } },
      orderBy: { nroOrden: 'desc' },
      select: { nroOrden: true },
    });
    const siguiente = ultima ? Number(ultima.nroOrden.slice(prefijo.length)) + 1 : 1;

    return `${prefijo}${String(siguiente).padStart(6, '0')}`;
  }
}
