import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'יצירת עסקה חדשה (סטטוס התחלתי: INITIATED)' })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'שליפת עסקה לפי ID' })
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
  
  @Patch(':id/status')
  @ApiOperation({ summary: 'עדכון סטטוס עסקה לאחר אישור/כישלון מהספק' })
  updateStatus(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.updateStatus(id, updateTransactionDto);
  }
}