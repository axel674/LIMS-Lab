import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoMuestraDto } from './create-tipo-muestra.dto';

export class UpdateTipoMuestraDto extends PartialType(CreateTipoMuestraDto) {}
