import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Sexo } from '../../../generated/prisma/client';

export class CreatePacienteDto {
  @IsString()
  @Matches(/^\d{7,10}$/, { message: 'El DNI debe tener entre 7 y 10 numeros' })
  dni: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  apellido: string;

  @IsDateString({}, { message: 'fechaNacimiento debe tener formato AAAA-MM-DD' })
  fechaNacimiento: string;

  @IsOptional()
  @IsEnum(Sexo, { message: 'sexo debe ser F, M o X' })
  sexo?: Sexo;

  @IsOptional()
  @IsString()
  @Length(6, 30)
  telefono?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email no tiene un formato valido' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(3, 120)
  domicilio?: string;

  @IsOptional()
  @IsInt({ message: 'obraSocialId debe ser un numero entero' })
  obraSocialId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  nroAfiliado?: string;
}
