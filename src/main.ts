import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import './common/bigint-json';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validacion global de los DTOs (TP 10)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const puerto = Number(process.env.PORT ?? 4000);
  await app.listen(puerto);
  console.log(`API escuchando en ${process.env.API_BASE_URL ?? `http://localhost:${puerto}/api`}`);
}

bootstrap();
