import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalisisModule } from '../analisis/analisis.module';
import { AuthModule } from '../auth/auth.module';
import { ObrasSocialesModule } from '../obras-sociales/obras-sociales.module';
import { OrdenesModule } from '../ordenes/ordenes.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TiposMuestraModule } from '../tipos-muestra/tipos-muestra.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Carga .env y expone DATABASE_URL, PORT, API_BASE_URL, JWT_SECRET y JWT_EXPIRES_IN
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PacientesModule,
    AnalisisModule,
    OrdenesModule,
    TiposMuestraModule,
    ObrasSocialesModule,
    // TP 12: registro y login con JWT
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
