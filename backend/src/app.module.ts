// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminsModule } from './sql-api-connection/admins/admins.module'; 

// 🟢 תיקון נתיבים למודולים בתוך sql-api-connection
import { CategoriesModule } from './sql-api-connection/categories/categories.module';
import { UsersModule } from './sql-api-connection/users/users.module';
import { ProductsModule } from './sql-api-connection/products/products.module';

// --- App Controller/Service ---
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- Entities ---
import { Product } from './sql-api-connection/entities/products.entity'; 
import { User } from './sql-api-connection/entities/users.entity'; 
import { Admin } from './sql-api-connection/entities/admins.entity';
import { Category } from './sql-api-connection/entities/categories.entity';
import { GroupMembership } from './sql-api-connection/entities/group_memberships.entity';
import { Group } from './sql-api-connection/entities/groups.entity';
import { HomepageMetric } from './sql-api-connection/entities/homepage_metrics.entity';
import { Notification } from './sql-api-connection/entities/notifications.entity';
import { ProductImage } from './sql-api-connection/entities/product_images.entity';
import { ProductPerformance } from './sql-api-connection/entities/product_performance.entity';
import { ProductSpec } from './sql-api-connection/entities/product_specs.entity';
import { SearchHistory } from './sql-api-connection/entities/search_history.entity';
import { Transaction } from './sql-api-connection/entities/transactions.entity';
import { UserSetting } from './sql-api-connection/entities/user_settings.entity';
import { Wishlist } from './sql-api-connection/entities/wishlist.entity';
import { AuditLog } from './sql-api-connection/entities/audit_logs.entity';
import { SearchHistoryModule } from './sql-api-connection/search_history/search-history.module';
import { UserSettingsModule } from './sql-api-connection/user_settings/user-settings.module';
import { WishlistModule } from './sql-api-connection/wishlist/wishlist.module';

// ✅ HealthModule
import { HealthModule } from './health/health.module'; 
import { audit } from 'rxjs';
import { AuditLogsModule } from './sql-api-connection/audit_logs/audit_logs.module';
import { group } from 'console';
import { GroupMembershipsModule } from './sql-api-connection/group_memberships/group_memberships.module';
import { GroupsModule } from './sql-api-connection/groups/groups.module';
import { HomepageMetricsModule } from './sql-api-connection/homepage_metrics/homepage_metrics.module';
import { NotificationsModule } from './sql-api-connection/notifications/notifications.module';
import { ProductImagesModule } from './sql-api-connection/product_images/product_images.module';
import { ProductPerformanceModule } from './sql-api-connection/product_performance/product_performance.module';
import { ProductSpecsModule } from './sql-api-connection/product_specs/product-specs.module';
import { TransactionsModule } from './sql-api-connection/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // 🟢 התיקון: הגדרת סוג הדאטה-בייס ופרטי החיבור במפורש
        type: 'postgres', // הגדרה קשיחה כדי למנוע את שגיאת ה-undefined
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        
        // רשימת ה-Entities
        entities: [
            Product, User, Admin, Category, GroupMembership, Group, 
            HomepageMetric, Notification, ProductImage, ProductPerformance, 
            ProductSpec, SearchHistory, Transaction, UserSetting, Wishlist, AuditLog
        ], 
        
        synchronize: true, // זהירות: בייצור יש לשים false
        logging: true,     
      }),
    }),

    // 3️⃣ מודולי האפליקציה:
    AdminsModule,
    UsersModule,
    ProductsModule, 
    HealthModule,
    CategoriesModule, 
    AuditLogsModule,
    GroupsModule,
    HomepageMetricsModule,
    NotificationsModule,  
    ProductImagesModule,
    ProductPerformanceModule,
    ProductSpecsModule,
    SearchHistoryModule,
    TransactionsModule,
    UserSettingsModule,
    GroupMembershipsModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}