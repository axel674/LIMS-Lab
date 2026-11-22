import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register -> 201 con el usuario creado (sin la contrasena)
  @Post('register')
  registrar(@Body() dto: RegisterDto) {
    return this.authService.registrar(dto);
  }

  // POST /api/auth/login -> 200 con { access_token, usuario }
  // (por defecto un POST responde 201; aca no se crea nada)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  iniciarSesion(@Body() dto: LoginDto) {
    return this.authService.iniciarSesion(dto);
  }
}
