import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateAnalisisDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: 'El codigo solo admite mayusculas, numeros, guion y guion bajo',
  })
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  nombre: string;

  @IsInt({ message: 'tipoMuestraId debe ser un numero entero' })
  tipoMuestraId: number;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  unidad?: string;

  @IsOptional()
  @IsNumber()
  valorRefMin?: number;

  @IsOptional()
  @IsNumber()
  valorRefMax?: number;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  valorRefTexto?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  diasDemora?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ub?: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  codigoNbu?: string;
}
