import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('search-history')
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly historyService: SearchHistoryService) {}

  // 1. POST: רישום חיפוש חדש (מתבצע אוטומטית בעת חיפוש)
  @Post()
  @ApiOperation({ summary: 'רישום חיפוש חדש ביומן ההיסטוריה' })
  @ApiResponse({ status: 201, description: 'רשומת החיפוש נוצרה.' })
  async create(@Body() createHistoryDto: CreateSearchHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  // 2. GET: שליפת היסטוריית חיפושים לפי UUID משתמש
  @Get('user/:userId')
  @ApiOperation({ summary: 'שליפת היסטוריית חיפושים אחרונים עבור משתמש' })
  async findAllByUserId(@Param('userId') userId: string) {
    return this.historyService.findAllByUserId(userId);
  }
}