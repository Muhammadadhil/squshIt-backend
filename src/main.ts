import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
