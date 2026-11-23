import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'email no tiene un formato valido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password no puede estar vacio' })
  @MaxLength(72)
  password: string;
}
