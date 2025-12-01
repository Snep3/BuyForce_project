// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // לאפשר קריאות מה-Next (localhost:3000)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
  console.log(
    `Nest is running on port ${process.env.PORT ?? 4000}`,
  );
}
bootstrap();
