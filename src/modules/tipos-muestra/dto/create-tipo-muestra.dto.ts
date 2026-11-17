import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTipoMuestraDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  nombre: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  tubo?: string;
}
