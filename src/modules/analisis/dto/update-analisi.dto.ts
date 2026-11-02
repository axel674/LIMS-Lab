import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalisiDto } from './create-analisi.dto.js';

export class UpdateAnalisiDto extends PartialType(CreateAnalisiDto) {}
