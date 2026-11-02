import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AnalisisModule } from '../analisis/analisis.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { InformesModule } from '../informes/informes.module.js';
import { MedicosModule } from '../medicos/medicos.module.js';
import { MuestrasModule } from '../muestras/muestras.module.js';
import { NotificacionesModule } from '../notificaciones/notificaciones.module.js';
import { ObrasSocialesModule } from '../obras-sociales/obras-sociales.module.js';
import { OrdenesModule } from '../ordenes/ordenes.module.js';
import { PacientesModule } from '../pacientes/pacientes.module.js';
import { PersonalModule } from '../personal/personal.module.js';
import { ResultadosModule } from '../resultados/resultados.module.js';
import { SucursalesModule } from '../sucursales/sucursales.module.js';
import { TurnosModule } from '../turnos/turnos.module.js';

@Module({
  imports: [
    AnalisisModule,
    AuthModule,
    InformesModule,
    MedicosModule,
    MuestrasModule,
    NotificacionesModule,
    ObrasSocialesModule,
    OrdenesModule,
    PacientesModule,
    PersonalModule,
    ResultadosModule,
    SucursalesModule,
    TurnosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
