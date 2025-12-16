// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Patch,
   Delete,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

    @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }


  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Param('id') productId: string,
    @Body() dto: AddCommentDto,
    @Req() req: any,
  ) {
    // JwtAuthGuard שלך שם את המשתמש ב-req.user (לפי הקוד שראינו)
    const userId = req?.user?.userId || req?.user?.id;
    return this.productsService.addComment(productId, userId, dto.content);
  }
}
