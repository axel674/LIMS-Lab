import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateOrdenDto {
  @IsUUID('4', { message: 'pacienteId debe ser un UUID valido' })
  pacienteId: string;

  @IsOptional()
  @IsInt({ message: 'obraSocialId debe ser un numero entero' })
  obraSocialId?: number;

  @IsOptional()
  @IsDateString({}, { message: 'fechaOrden debe tener formato AAAA-MM-DD' })
  fechaOrden?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  observaciones?: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'La orden necesita al menos un analisis' })
  @IsInt({ each: true, message: 'analisisIds debe ser una lista de ids' })
  analisisIds: number[];
}
