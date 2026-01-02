import { AdminModule } from './admin/admin.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { HealthModule } from './health/health.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { SearchHistoryModule } from './search_history/search-history.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProductImagesModule } from './product_images/product_images.module';
import { ProductSpecsModule } from './product_specs/product-specs.module';
import { ProductPerformanceModule } from './product_performance/product_performance.module';
import { HomepageMetricsModule } from './homepage_metrics/homepage_metrics.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { GroupsModule } from './groups/groups.module';
import { GroupMembershipsModule } from './group_memberships/group_memberships.module';
import { AuditLogsModule } from './audit_logs/audit_logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CombinedGroupsController } from './groups/combined-groups.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    AdminModule,
    HealthModule,
    WishlistModule,
    SearchHistoryModule,
    NotificationsModule,
    ProductImagesModule,  
    ProductSpecsModule,
    ProductPerformanceModule,
    HomepageMetricsModule,
    CategoriesModule,
    TransactionsModule,
    GroupsModule,
    GroupMembershipsModule,
    AuditLogsModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, CombinedGroupsController],
  providers: [AppService],
})
export class AppModule {}