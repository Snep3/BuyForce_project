//ה-Controller יחשוף נקודות קצה להוספה, שליפה והסרה.
// ניתוב
import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistResponseDto } from './dto/wishlist-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'הוספת מוצר לרשימת המשאלות' })
  @ApiResponse({ status: 201, type: WishlistResponseDto })
  async create(@Body() createDto: CreateWishlistDto): Promise<WishlistResponseDto> {
    const item = await this.wishlistService.create(createDto);
    return WishlistResponseDto.fromEntity(item);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'שליפת רשימת המשאלות המלאה של משתמש' })
  @ApiResponse({ status: 200, type: [WishlistResponseDto] })
  async findAllByUser(@Param('userId') userId: string): Promise<WishlistResponseDto[]> {
    const list = await this.wishlistService.findAllByUser(userId);
    return list.map(item => WishlistResponseDto.fromEntity(item));
  }
  
  @Delete(':userId/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'הסרת מוצר מרשימת המשאלות' })
  async remove(
    @Param('userId') userId: string, 
    @Param('productId') productId: string
  ): Promise<void> {
    return this.wishlistService.remove(userId, productId);
  }
}