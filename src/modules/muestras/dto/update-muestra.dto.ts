import { PartialType } from '@nestjs/mapped-types';
import { CreateMuestraDto } from './create-muestra.dto.js';

export class UpdateMuestraDto extends PartialType(CreateMuestraDto) {}
