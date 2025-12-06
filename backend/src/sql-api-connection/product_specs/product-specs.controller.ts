import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductSpecsService } from './product_specs.service';
import { CreateProductSpecDto } from './dto/create-product-specs.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('product-specs')
@Controller('product-specs')
export class ProductSpecsController {
  constructor(private readonly productSpecsService: ProductSpecsService) {}

  // 1. POST: יצירת מפרט חדש
  // POST /product-specs
  @Post()
  @ApiOperation({ summary: 'יצירת מפרט מוצר חדש (spec_key/spec_value)' })
  @ApiResponse({ status: 201, description: 'המפרט נוצר בהצלחה.' })
  async create(@Body() createSpecDto: CreateProductSpecDto) {
    return this.productSpecsService.create(createSpecDto);
  }

  // 2. GET: שליפת כל המפרטים של מוצר מסוים
  // GET /product-specs/product/123e4567-e89b-12d3-a456-426614174000
  @Get('product/:productId')
  @ApiOperation({ summary: 'שליפת כל מפרטי המוצר לפי UUID המוצר' })
  async findAllByProductId(@Param('productId') productId: string) {
    return this.productSpecsService.findAllByProductId(productId);
  }
}