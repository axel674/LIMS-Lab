import { PartialType } from '@nestjs/mapped-types';
import { CreateObrasSocialeDto } from './create-obras-sociale.dto.js';

export class UpdateObrasSocialeDto extends PartialType(CreateObrasSocialeDto) {}
