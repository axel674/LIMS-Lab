import { Injectable } from '@nestjs/common';
import { CreateObrasSocialeDto } from './dto/create-obras-sociale.dto.js';
import { UpdateObrasSocialeDto } from './dto/update-obras-sociale.dto.js';

@Injectable()
export class ObrasSocialesService {
  create(createObrasSocialeDto: CreateObrasSocialeDto) {
    return 'This action adds a new obrasSociale';
  }

  findAll() {
    return `This action returns all obrasSociales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} obrasSociale`;
  }

  update(id: number, updateObrasSocialeDto: UpdateObrasSocialeDto) {
    return `This action updates a #${id} obrasSociale`;
  }

  remove(id: number) {
    return `This action removes a #${id} obrasSociale`;
  }
}
