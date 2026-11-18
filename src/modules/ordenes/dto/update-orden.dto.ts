import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { EstadoOrden } from '../../../generated/prisma/client';
import { CreateOrdenDto } from './create-orden.dto';

export class UpdateOrdenDto extends PartialType(CreateOrdenDto) {
  @IsOptional()
  @IsEnum(EstadoOrden, {
    message: 'estado debe ser abierta, en_proceso, completa, informada o anulada',
  })
  estado?: EstadoOrden;

  @IsOptional()
  @IsString()
  @Length(1, 300)
  motivoAnulacion?: string;
}
