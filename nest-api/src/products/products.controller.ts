// src/products/products.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Req,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /api/products
  @Get()
  async getAll(@Res() res: Response) {
    try {
      const products = await this.productsService.findAll();
      return res.json(products);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }
  

  // GET /api/products/:id
  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    try {
      const product = await this.productsService.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(product);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // POST /api/products
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('category') category: string,
    @Body('stock') stock: number,
    @Body('description') description: string,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productsService.createProduct({
        name,
        price,
        category,
        stock,
        description,
      });
      return res.status(201).json(product);
    } catch (err: any) {
      if (err.message === 'Name, price, and category are required') {
        return res.status(400).json({ error: err.message });
      }
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // POST /api/products/:id/comments
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = (req as any).userId;
      const product = await this.productsService.addComment(
        id,
        userId,
        content,
      );
      return res.json(product);
    } catch (err: any) {
      if (err.message === 'Comment content required') {
        return res.status(400).json({ error: err.message });
      }
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }
  // הוסף את ה-Decorator-ים הבאים ל-Imports בראש הקובץ: Put, Delete

@UseGuards(JwtAuthGuard)
@Put(':id')
async update(@Param('id') id: string, @Body() patch: any, @Res() res: Response) {
  try {
    const updated = await this.productsService.updateProduct(id, patch);
    return res.json(updated);
  } catch (err: any) {
    return res.status(err.status || 500).json({ error: err.message });
  }
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
async remove(@Param('id') id: string, @Res() res: Response) {
  try {
    await this.productsService.deleteProduct(id);
    return res.json({ deleted: true });
  } catch (err: any) {
    return res.status(err.status || 500).json({ error: err.message });
  }
}
}
