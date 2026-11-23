import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  apellido: string;

  // Se guarda en minusculas y sin espacios: "Ana@Lab.com " y "ana@lab.com" son el mismo usuario
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'email no tiene un formato valido' })
  email: string;

  // bcrypt solo usa los primeros 72 bytes: se limita para que no se corte sin avisar
  @IsString()
  @Length(8, 72, { message: 'password debe tener entre 8 y 72 caracteres' })
  password: string;
}
