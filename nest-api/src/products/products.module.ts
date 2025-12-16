// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';


@Module({
  imports: [TypeOrmModule.forFeature([Product, Comment])],
  providers: [ProductsService, JwtAuthGuard, AdminGuard],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
