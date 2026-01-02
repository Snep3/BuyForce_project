import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); 

  app.getHttpAdapter().getInstance().use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  // עדכון CORS: הוספת ה-IP כדי שהמובייל יוכל לתקשר עם השרת
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://127.0.0.1:3000',
      'http://10.100.102.5:3000', // Web דרך IP
      'http://10.100.102.5:4000',
      /\.localhost$/, // מאפשר את כל ה-subdomains של localhost
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true, 
      transform: true,           
    }),
  );

  const port = process.env.PORT ?? 4000;
  
  // האזנה ל-0.0.0.0 הכרחית לגישה מה-IP של הרשת
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Nest is running on: http://10.100.102.5:${port}/api`);
}
bootstrap();