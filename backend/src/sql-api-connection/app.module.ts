// src/app.module.ts (התיקון המלא והמומלץ ביותר)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// משתמשים ב-Named Import, כאשר הקלאס חייב להיות באות גדולה (PascalCase)
import { Admin } from './entities/admins.entity'; 
import { AuditLog } from './entities/audit_logs.entity'; 
import { Category } from './entities/categories.entity'; 
import { GroupMembership } from './entities/group_memberships.entity'; 
import { Group } from './entities/groups.entity'; 
import { HomepageMetric } from './entities/homepage_metrics.entity'; 
import { Notification } from './entities/notifications.entity'; 
import { ProductImage } from './entities/product_images.entity'; 
import { ProductPerformance } from './entities/product_performance.entity'; 
import { ProductSpec } from './entities/product_specs.entity'; 
import { Product } from './entities/products.entity'; 
import { SearchHistory } from './entities/search_history.entity'; 
import { Transaction } from './entities/transactions.entity'; 
import { UserSetting } from './entities/user_settings.entity'; 
import { User } from './entities/users.entity'; 
import { Wishlist } from './entities/wishlist.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ... הגדרות DB
      entities: [
        Admin, AuditLog, Category, GroupMembership, Group, 
        HomepageMetric, Notification, ProductImage, ProductPerformance, 
        ProductSpec, Product, SearchHistory, Transaction, 
        UserSetting, User, Wishlist
      ],
      // ...
    }),
  ],
})
export class AppModule {}