// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // לאפשר קריאות מה-Next (localhost:3001)
  app.enableCors({
    origin: 'http://localhost:3001',
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


  const port = Number(process.env.PORT) || 4001;
await app.listen(port, '0.0.0.0');
console.log('LISTENING ON', port);

  // const port = process.env.PORT ?? 4001;
  // await app.listen(port);

  // console.log(`Nest is running on port ${port}`);
}

bootstrap();
