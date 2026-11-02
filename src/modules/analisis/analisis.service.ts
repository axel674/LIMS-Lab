import { Injectable } from '@nestjs/common';
import { CreateAnalisiDto } from './dto/create-analisi.dto.js';
import { UpdateAnalisiDto } from './dto/update-analisi.dto.js';

@Injectable()
export class AnalisisService {
  create(createAnalisiDto: CreateAnalisiDto) {
    return 'This action adds a new analisi';
  }

  findAll() {
    return `This action returns all analisis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analisi`;
  }

  update(id: number, updateAnalisiDto: UpdateAnalisiDto) {
    return `This action updates a #${id} analisi`;
  }

  remove(id: number) {
    return `This action removes a #${id} analisi`;
  }
}
