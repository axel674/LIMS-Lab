import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Costo de bcrypt: 10 vueltas es el valor recomendado (tarda unos milisegundos por hash)
const VUELTAS_BCRYPT = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Crea el usuario con la contrasena hasheada. Devuelve el usuario sin el hash
  async registrar(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, VUELTAS_BCRYPT);
    return this.usersService.crear({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      passwordHash,
    });
  }

  // Si el email y la contrasena coinciden, devuelve un JWT firmado con JWT_SECRET
  async iniciarSesion(dto: LoginDto) {
    const usuario = await this.usersService.buscarPorEmail(dto.email);

    // El mismo mensaje si no existe el email o si la contrasena no coincide:
    // asi no se puede averiguar que emails estan registrados
    const coincide = usuario ? await bcrypt.compare(dto.password, usuario.passwordHash) : false;
    if (!usuario || !coincide || !usuario.activo) {
      throw new UnauthorizedException('Email o contrasena incorrectos');
    }

    // sub (subject) es el id del usuario, como recomienda el estandar JWT
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
