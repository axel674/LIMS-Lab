import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdeneDto } from './create-ordene.dto.js';

export class UpdateOrdeneDto extends PartialType(CreateOrdeneDto) {}
