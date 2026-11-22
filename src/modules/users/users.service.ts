import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Datos para crear un usuario: la contrasena ya llega hasheada desde AuthService
export interface NuevoUsuario {
  nombre: string;
  apellido: string;
  email: string;
  passwordHash: string;
}

// Lo que se puede mostrar de un usuario: todo menos el hash de la contrasena
const CAMPOS_PUBLICOS = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  rol: true,
  activo: true,
  creadoEn: true,
} as const;

/**
 * Acceso a la tabla usuarios (TP 12). No tiene controller propio: los usuarios
 * se crean solo con POST /api/auth/register, para no duplicar la operacion.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Con el hash: lo usa solo el login para comparar la contrasena
  buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async crear(datos: NuevoUsuario) {
    try {
      return await this.prisma.usuario.create({
        data: datos,
        select: CAMPOS_PUBLICOS,
      });
    } catch (error) {
      if (this.esError(error, 'P2002')) {
        throw new ConflictException(`Ya existe un usuario con el email ${datos.email}`);
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
