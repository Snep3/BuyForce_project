import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 1. POST: יצירת מוצר חדש
  @Post()
  @ApiOperation({ summary: 'יצירת מוצר חדש' })
  @ApiResponse({ status: 201, description: 'המוצר נוצר בהצלחה.' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // 2. GET ALL: שליפת כל המוצרים הפעילים
  @Get()
  @ApiOperation({ summary: 'שליפת כל המוצרים הפעילים' })
  async findAllActive() {
    return this.productsService.findAllActive();
  }

  // 3. GET ONE: שליפת מוצר לפי ID
  @Get(':id')
  @ApiOperation({ summary: 'שליפת מוצר לפי UUID' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // 4. PATCH: עדכון מוצר קיים
  @Patch(':id')
  @ApiOperation({ summary: 'עדכון מוצר קיים (עדכון חלקי)' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  // 5. DELETE: מחיקה רכה (Soft Delete)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'מחיקה רכה (Soft Delete) של מוצר' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
  }
}