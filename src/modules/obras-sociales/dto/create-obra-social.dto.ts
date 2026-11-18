import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateObraSocialDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 80)
  nombre: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  codigo?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
