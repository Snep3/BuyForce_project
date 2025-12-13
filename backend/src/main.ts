import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🟢 התיקון הקריטי ל-404: הגדרת Prefix גלובלי
  // כל הנתיבים (Routes) של ה-Controllers יתחילו כעת ב- /sql-api-connection
  app.setGlobalPrefix('sql-api-connection');

  // --- הגדרות ValidationPipe (אבטחה ואימות קלט) ---
  app.useGlobalPipes(new ValidationPipe({
    // מאפשר להשתמש ב-DTOs כ-Instances של מחלקות
    transform: true, 
    // מונע קבלה של שדות לא מוגדרים ב-DTO
    whitelist: true, 
    // זורק שגיאה אם יש שדות מיותרים ב-Payload
    forbidNonWhitelisted: true, 
  }));

  // --- הגדרות Swagger/OpenAPI (תיעוד API) ---
  const config = new DocumentBuilder()
    .setTitle('SQL API Connection')
    .setDescription('API documentation for the SQL-backed NestJS application.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // ה-Swagger UI יהיה נגיש בנתיב המלא: /sql-api-connection/api
  SwaggerModule.setup('api', app, document); 

  // --- הפעלת השרת ---
  // מאזין לפורט שמוגדר במשתנה סביבה (PORT) או לפורט 3000 כברירת מחדל
  await app.listen(process.env.PORT ?? 3000); 
}

bootstrap();