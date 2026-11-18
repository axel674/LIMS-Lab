import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalisisModule } from '../analisis/analisis.module';
import { ObrasSocialesModule } from '../obras-sociales/obras-sociales.module';
import { OrdenesModule } from '../ordenes/ordenes.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TiposMuestraModule } from '../tipos-muestra/tipos-muestra.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Carga .env y expone DATABASE_URL, PORT y API_BASE_URL
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PacientesModule,
    AnalisisModule,
    OrdenesModule,
    TiposMuestraModule,
    ObrasSocialesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
