// src/products/products.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// 👉 Added for Swagger
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

// 👉 Added for Swagger (Tag grouping)
@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /api/products
  // 👉 Added for Swagger
  @ApiOperation({ summary: 'Get all products' })
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
  // 👉 Added for Swagger
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
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
  // 👉 Added for Swagger
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Product data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        category: { type: 'string' },
        stock: { type: 'number' },
        description: { type: 'string' },
      },
      required: ['name', 'price', 'category'],
    },
  })
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
      if (!name || !price || !category) {
        return res.status(400).json({
          error: 'Name, price, and category are required',
        });
      }

      const product = await this.productsService.createProduct({
        name,
        price,
        category,
        stock,
        description,
      });

      return res.status(201).json(product);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // PATCH /api/products/:id
  // 👉 Added for Swagger
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    description: 'Fields to update',
    schema: { type: 'object', additionalProperties: true },
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.productsService.updateProduct(id, updateData);

      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json(updated);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // DELETE /api/products/:id
  // 👉 Added for Swagger
  @ApiOperation({ summary: 'Delete a product' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      const deleted = await this.productsService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json({ message: 'Product deleted successfully' });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // POST /api/products/:id/comments
  // 👉 Added for Swagger
  @ApiOperation({ summary: 'Add a comment to a product' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    description: 'Comment content',
    schema: {
      type: 'object',
      properties: { content: { type: 'string' } },
      required: ['content'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (!content?.trim()) {
        return res.status(400).json({ error: 'Comment content required' });
      }

      const userId = (req as any).userId;

      const product = await this.productsService.addComment(
        id,
        userId,
        content,
      );

      return res.json(product);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }
}
