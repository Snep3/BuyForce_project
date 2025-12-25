import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductSpecsService } from './product_specs.service';
import { CreateProductSpecDto } from './dto/create-product-specs.dto';
// ✅ ייבוא DTO לעדכון
import { UpdateProductSpecDto } from './dto/update-product-spec.dto'; 
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('product-specs')
@Controller('product-specs')
export class ProductSpecsController {
  constructor(private readonly productSpecsService: ProductSpecsService) {}

  // 1. POST: יצירת מפרט חדש
  @Post()
  @HttpCode(HttpStatus.CREATED) // כדי להבטיח קוד 201
  @ApiOperation({ summary: 'יצירת מפרט מוצר חדש (spec_key/spec_value)' })
  @ApiResponse({ status: 201, description: 'המפרט נוצר בהצלחה.' })
  async create(@Body() createSpecDto: CreateProductSpecDto) {
    return this.productSpecsService.create(createSpecDto);
  }
    
  // 2. GET: שליפת מפרט בודד
  @Get(':id')
  @ApiOperation({ summary: 'שליפת מפרט בודד לפי ID (מספר)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.productSpecsService.findOne(id);
  }

  // 3. GET: שליפת כל המפרטים של מוצר מסוים
  @Get('product/:productId')
  @ApiOperation({ summary: 'שליפת כל מפרטי המוצר לפי UUID המוצר' })
  async findAllByProductId(@Param('productId') productId: string) {
    return this.productSpecsService.findAllByProductId(productId);
  }

  // 🛑 הוספת מתודת PUT לעדכון כל המפרטים של מוצר
  // PUT /product-specs/product/:productId
  // מקבל מערך של CreateProductSpecDto כי זו החלפה מלאה
  @Put('product/:productId')
  @ApiOperation({ summary: 'עדכון/החלפת כל מפרטי המוצר לפי UUID המוצר' })
  @ApiResponse({ status: 200, description: 'המפרטים הוחלפו בהצלחה.' })
  async updateAllByProductId(
      @Param('productId') productId: string,
      @Body() updateSpecsDto: CreateProductSpecDto[] // דורש מערך
  ) {
      // קורא למתודה החדשה ב-Service
      return this.productSpecsService.updateAllByProductId(productId, updateSpecsDto);
  }

  // 4. PUT: עדכון מפרט מוצר בודד
  // PUT /product-specs/:id
  @Put(':id')
  @ApiOperation({ summary: 'עדכון מפרט מוצר קיים לפי ID' })
  @ApiResponse({ status: 200, description: 'המפרט עודכן בהצלחה.' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSpecDto: UpdateProductSpecDto
  ) {
    return this.productSpecsService.update(id, updateSpecDto);
  }
}