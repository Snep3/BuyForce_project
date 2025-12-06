import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto'; 
import { SearchHistory } from '../entities/search_history.entity'; 

@Injectable()
export class SearchHistoryService {
  constructor(
    @InjectRepository(SearchHistory)
    private historyRepository: Repository<SearchHistory>,
  ) {}

  // 1. CREATE: רישום חיפוש חדש
  async create(createHistoryDto: CreateSearchHistoryDto): Promise<SearchHistory> {
    const newLog = this.historyRepository.create(createHistoryDto); 
    // נתקלנו בשגיאות ב-save/create, שימוש ב-as any עוזר לעקוף בעיות טיפוס זמניות
    //
    return await this.historyRepository.save(newLog as any); 
  }

  // 2. READ ALL: שליפת היסטוריית חיפושים לפי userId
  async findAllByUserId(userId: string): Promise<SearchHistory[]> {
    // שם המאפיין ב-Entity הוא userId (camelCase)
    return await this.historyRepository.find({ 
      where: { userId: userId },
      order: { createdAt: 'DESC' }, // הסדר הכרונולוגי העדכני ביותר
      take: 20 // הגבלה ל-20 החיפושים האחרונים למשל
    });
  }
}