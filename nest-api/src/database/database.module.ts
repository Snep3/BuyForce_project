// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../products/product.entity';
import { Comment } from '../products/comment.entity';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { GroupMembership } from 'src/group_memberships/group_memberships.entity';
import { Admin } from 'src/admins/admins.entity';
import { AuditLog } from 'src/audit_logs/audit_logs.entity';
import { he } from 'date-fns/locale';
import { Category } from 'src/categories/categories.entity';
import { HomepageMetric } from 'src/homepage_metrics/homepage_metrics.entity';
import { Notification } from 'src/notifications/notifications.entity';
import { ProductImage } from 'src/product_images/product_images.entity';
import { ProductPerformance } from 'src/product_performance/product_performance.entity';
import { ProductSpec } from 'src/product_specs/product_specs.entity';
import { SearchHistory } from 'src/search_history/search_history.entity';
import { Transaction } from 'src/transactions/transactions.entity';
import { UserSetting } from 'src/user_settings/user_settings.entity';
import { Wishlist } from 'src/wishlist/wishlist.entity';

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
          Product,
          Comment,
          User,
          Group,
          GroupMembership,
          Admin,
          AuditLog,
          Category,
          HomepageMetric,
          Notification,
          ProductImage,
          ProductPerformance,
          ProductSpec,
          SearchHistory,
          Transaction,
          UserSetting,
          Wishlist,
        ],
        synchronize: true, // dev only
        logging: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
