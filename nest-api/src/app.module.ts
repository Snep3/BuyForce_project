// src/app.module.ts
// Main application module
import { Module } from '@nestjs/common';
// Importing ConfigModule to manage environment variables
import { ConfigModule } from '@nestjs/config';
// Importing application controllers and services
import { AppController } from './app.controller';
// Importing database module for DB connection
import { AppService } from './app.service';
// Importing feature modules
import { DatabaseModule } from './database/database.module';
// Importing other feature modules
import { UsersModule } from './users/users.module';
 // Importing GroupsModule to handle group-related functionalities 
import { ProductsModule } from './products/products.module';
// Importing GroupsModule to handle group-related functionalities
import { GroupsModule } from './groups/groups.module';
// Importing OrdersModule to handle order-related functionalities
import { OrdersModule } from './orders/orders.module';
// Importing AdminModule to handle admin-related functionalities
import { AdminModule } from './admin/admin.module';
// Importing NotificationsModule to handle notifications functionalities
import { NotificationsModule } from './notifications/notifications.module';


// Defining the main application module
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    GroupsModule, // 👈 חשוב שזה פה
    OrdersModule,
    AdminModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
