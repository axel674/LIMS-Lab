import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.paciente.findMany({
      include: { obraSocial: true },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
  }

  async obtener(id: string) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: {
        obraSocial: true,
        ordenes: {
          include: { items: { include: { analisis: true } } },
          orderBy: { fechaOrden: 'desc' },
        },
      },
    });

    if (!paciente) {
      throw new NotFoundException(`No existe el paciente con id ${id}`);
    }

    return paciente;
  }

  async crear(dto: CreatePacienteDto) {
    await this.verificarObraSocial(dto.obraSocialId);

    try {
      return await this.prisma.paciente.create({
        data: {
          dni: dto.dni,
          nombre: dto.nombre,
          apellido: dto.apellido,
          fechaNacimiento: new Date(dto.fechaNacimiento),
          sexo: dto.sexo,
          telefono: dto.telefono,
          email: dto.email,
          domicilio: dto.domicilio,
          obraSocialId: dto.obraSocialId ? BigInt(dto.obraSocialId) : null,
          nroAfiliado: dto.nroAfiliado,
        },
        include: { obraSocial: true },
      });
    } catch (error) {
      if (this.esError(error, 'P2002')) {
        throw new ConflictException(`Ya existe un paciente con el DNI ${dto.dni}`);
      }
      throw error;
    }
  }

  async actualizar(id: string, dto: UpdatePacienteDto) {
    await this.obtener(id);
    await this.verificarObraSocial(dto.obraSocialId);

    try {
      return await this.prisma.paciente.update({
        where: { id },
        data: {
          dni: dto.dni,
          nombre: dto.nombre,
          apellido: dto.apellido,
          fechaNacimiento: dto.fechaNacimiento
            ? new Date(dto.fechaNacimiento)
            : undefined,
          sexo: dto.sexo,
          telefono: dto.telefono,
          email: dto.email,
          domicilio: dto.domicilio,
          obraSocialId:
            dto.obraSocialId === undefined
              ? undefined
              : dto.obraSocialId === null
                ? null
                : BigInt(dto.obraSocialId),
          nroAfiliado: dto.nroAfiliado,
        },
        include: { obraSocial: true },
      });
    } catch (error) {
      if (this.esError(error, 'P2002')) {
        throw new ConflictException(`Ya existe un paciente con el DNI ${dto.dni}`);
      }
      throw error;
    }
  }

  async eliminar(id: string) {
    await this.obtener(id);

    try {
      await this.prisma.paciente.delete({ where: { id } });
      return { eliminado: true, id };
    } catch (error) {
      if (this.esError(error, 'P2003')) {
        throw new ConflictException(
          'El paciente tiene ordenes asociadas: no se puede eliminar',
        );
      }
      throw error;
    }
  }

  private async verificarObraSocial(obraSocialId?: number) {
    if (obraSocialId === undefined || obraSocialId === null) {
      return;
    }

    const existe = await this.prisma.obraSocial.findUnique({
      where: { id: BigInt(obraSocialId) },
    });

    if (!existe) {
      throw new NotFoundException(
        `No existe la obra social con id ${obraSocialId}`,
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
