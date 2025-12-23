// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../products/product.entity';
import { Comment } from '../products/comment.entity';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';

@Module({
  imports: [
    // נשתמש ב-ConfigModule כדי לקרוא את משתני הסביבה (.env)
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', '123456'),
        database: config.get<string>('DB_DATABASE', 'BuyForce_sql'),
        entities: [Product, Comment, User, Group],
        // יש לך כבר סכימה מ-db.sql, אז עדיף false
        synchronize: false,
        logging: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
