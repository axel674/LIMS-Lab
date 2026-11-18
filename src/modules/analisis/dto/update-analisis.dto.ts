import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalisisDto } from './create-analisis.dto';

export class UpdateAnalisisDto extends PartialType(CreateAnalisisDto) {}
