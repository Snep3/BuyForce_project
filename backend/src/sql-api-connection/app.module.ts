import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 🟢 תיקון הנתיבים: הוסר הקידומת "./sql-api-connection/"
import { CategoriesModule } from './categories/categories.module'; 

// 🟢 תיקון הנתיבים: מודולי אפליקציה
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
// אם health module נמצא מחוץ לתיקייה הנוכחית, הוא צריך להיות כך:
// import { HealthModule } from '../health/health.module'; // ⬅️ יש לוודא מיקום זה
import { HealthModule } from '../health/health.module'; // ⬅️ הנחה שהוא ב-src/health

// --- Entities (גם כן תיקון נתיב) ---
import { Admin } from './entities/admins.entity'; 
import { AuditLog } from './entities/audit_logs.entity'; 
import { Category } from './entities/categories.entity'; 
// ... (שאר ה-Entities)
import { Product } from './entities/products.entity'; 
import { User } from './entities/users.entity'; 
import { Wishlist } from './entities/wishlist.entity'; 

// --- App Controller/Service (נתיב יחסי) ---
// ודא שקבצים אלה נמצאים ישירות בתוך sql-api-connection/
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { Module } from '@nestjs/common';


@Module({
  imports: [
    // 1️⃣ ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    
    // 2️⃣ TypeORM (שחזור ל-forRootAsync שהיה לך, כי זה נכון עם ConfigService)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        // ... (הגדרות host, port, username, password, database)
        // ⬅️ הנחתי שהנתיבים היחסיים השתנו, שים לב לתקן אותם
        entities: [
            Admin, AuditLog, Category, // ... שאר ה-Entities
            Product, 
            User, Wishlist 
        ],
        synchronize: true, 
        logging: true,     
      }),
    }),

    // 3️⃣ מודולי האפליקציה (שחזור והוספת המודול החסר)
    UsersModule,
    ProductsModule, 
    HealthModule,
    
    // 🟢 התיקון הקריטי: הוספת CategoriesModule
    CategoriesModule, 

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}