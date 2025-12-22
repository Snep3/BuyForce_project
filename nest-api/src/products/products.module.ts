import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { Category } from '../categories/categories.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard'; // הוספנו את ה-AdminGuard

@Module({
  imports: [
    // משתמשים ב-TypeOrmModule במקום MongooseModule
    TypeOrmModule.forFeature([Product, Comment, Category]),
  ],
  providers: [
    ProductsService, 
    JwtAuthGuard, 
    AdminGuard // הוספת המנהל למערכת ההרשאות
  ],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}