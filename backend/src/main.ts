// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. ייבוא ה-ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // הוספת הגדרת ה-ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    // הופך את ה-Payload למופע של המחלקה (DTO), מה שמאפשר שימוש ב-Decorators
    transform: true, 
    // מסיר שדות שלא מוגדרים ב-DTO (מומלץ לאבטחה)
    whitelist: true, 
    // זורק שגיאה אם ה-Payload מכיל שדות שלא קיימים ב-DTO
    forbidNonWhitelisted: true, 
  }));

  // שימוש במשתנה סביבה עבור הפורט, כפי שהיה בקובץ המקורי שלך
  await app.listen(process.env.PORT ?? 3000); 
}

bootstrap();