import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  obtenerInfo() {
    return {
      servicio: 'LIMS Lab API',
      descripcion: 'Backend NestJS + Prisma + PostgreSQL del TP 9, TP 10 y TP 11',
      estado: 'ok',
      recursos: ['/api/pacientes', '/api/analisis', '/api/ordenes'],
    };
  }
}
