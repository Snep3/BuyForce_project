import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryController } from './search-history.controller';
import { SearchHistory } from '../entities/search_history.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([SearchHistory]),
  ],
  controllers: [SearchHistoryController],
  providers: [SearchHistoryService],
  // ייצוא השירות אם מודול אחר צריך להשתמש בו לרישום היסטוריה
  exports: [SearchHistoryService], 
})
export class SearchHistoryModule {}