// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductsService, JwtAuthGuard],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
