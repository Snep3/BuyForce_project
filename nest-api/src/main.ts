// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('BuyForce API')
    .setDescription('API documentation for BuyForce app')
    .setVersion('1.0')
    .addBearerAuth() // optional: enables JWT button in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Run server
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Nest is running on http://localhost:${port}`);
  console.log(`📄 Swagger docs at http://localhost:${port}/api-docs`);
}

bootstrap();
