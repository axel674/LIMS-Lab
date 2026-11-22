import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObraSocialDto } from './dto/create-obra-social.dto';
import { UpdateObraSocialDto } from './dto/update-obra-social.dto';

@Injectable()
export class ObrasSocialesService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.obraSocial.findMany({ orderBy: { nombre: 'asc' } });
  }

  async obtener(id: number) {
    const obraSocial = await this.prisma.obraSocial.findUnique({
      where: { id: BigInt(id) },
      include: { pacientes: true },
    });

    if (!obraSocial) {
      throw new NotFoundException(`No existe la obra social con id ${id}`);
    }

    return obraSocial;
  }

  async crear(dto: CreateObraSocialDto) {
    try {
      return await this.prisma.obraSocial.create({
        data: {
          nombre: dto.nombre,
          codigo: dto.codigo,
          activa: dto.activa ?? true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Ya existe la obra social ${dto.nombre}`);
      }
      throw error;
    }
  }

  async actualizar(id: number, dto: UpdateObraSocialDto) {
    await this.obtener(id);
    return this.prisma.obraSocial.update({
      where: { id: BigInt(id) },
      data: { nombre: dto.nombre, codigo: dto.codigo, activa: dto.activa },
    });
  }

  async eliminar(id: number) {
    await this.obtener(id);

    try {
      await this.prisma.obraSocial.delete({ where: { id: BigInt(id) } });
      return { eliminado: true, id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          'Hay pacientes u ordenes con esta obra social: conviene desactivarla',
        );
      }
      throw error;
    }
  }
}
