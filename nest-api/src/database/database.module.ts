// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../products/product.entity';
import { Comment } from '../products/comment.entity';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { GroupMembership } from '../group_memberships/group_memberships.entity';
import { Admin } from '../admins/admins.entity';
import { AuditLog } from '../audit_logs/audit_logs.entity';
import { Category } from '../categories/categories.entity';
import { HomepageMetric } from '../homepage_metrics/homepage_metrics.entity';
import { Notification } from '../notifications/notifications.entity';
import { ProductImage } from '../product_images/product_images.entity';
import { ProductPerformance } from '../product_performance/product_performance.entity';
import { ProductSpec } from '../product_specs/product_specs.entity';
import { SearchHistory } from '../search_history/search_history.entity';
import { Transaction } from '../transactions/transactions.entity';
import { UserSetting } from '../user_settings/user_settings.entity';
import { Wishlist } from '../wishlist/wishlist.entity';

@Module({
  imports: [
    ConfigModule,
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
        entities: [
          Product, Comment, User, Group, GroupMembership, Admin,
          AuditLog, Category, HomepageMetric, Notification,
          ProductImage, ProductPerformance, ProductSpec,
          SearchHistory, Transaction, UserSetting, Wishlist,
        ],
        synchronize: true, // dev only
        logging: true,
        // התיקון כאן: הגדרת קידוד עבור PostgreSQL
        extra: {
          charset: 'utf8',
        },
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}