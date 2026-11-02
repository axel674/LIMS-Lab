import { PartialType } from '@nestjs/mapped-types';
import { CreateInformeDto } from './create-informe.dto.js';

export class UpdateInformeDto extends PartialType(CreateInformeDto) {}
