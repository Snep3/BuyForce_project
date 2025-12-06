// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// ✅ ייבוא מודולים של האפליקציה
import { UsersModule } from './sql-api-connection/users/users.module';

@Module({
  imports: [
    // 1️⃣ קונפיגורציה גלובלית (קריאת .env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 2️⃣ חיבור TypeORM/PostgreSQL מותאם ל-dev ו-prod
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),

        // entities מותאמות גם ל-ts-node (dev) וגם ל-dist (prod)
        entities: [
          __dirname + (process.env.NODE_ENV === 'production'
            ? '/**/*.entity.js'
            : '/**/*.entity.ts'),
        ],

        synchronize: true, // שימושי לפיתוח
        logging: true,     // מציג שאילתות בטרמינל
      }),
    }),

    // 3️⃣ מודולי האפליקציה
    UsersModule,
    // אפשר להוסיף כאן מודולים נוספים, כמו ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
