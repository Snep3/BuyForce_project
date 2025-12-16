// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // לאפשר קריאות מה-Next (localhost:3000)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // הפעלת ולידציה גלובלית (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // מוחק שדות שלא מוגדרים ב-DTO
      forbidNonWhitelisted: true, // מחזיר 400 אם שלחו שדה לא חוקי
      transform: true,           // מאפשר class-transformer
    }),
  );

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`Nest is running on port ${port}`);
}

bootstrap();
