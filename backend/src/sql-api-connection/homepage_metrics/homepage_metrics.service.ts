// src/homepage_metrics/homepage_metrics.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageMetric } from '../entities/homepage_metrics.entity';
import { CreateHomepageMetricDto } from './dto/create-homepage-metric.dto';
import { Category } from '../../sql-api-connection/entities/categories.entity';
@Injectable()
export class HomepageMetricsService {
  constructor(
    @InjectRepository(HomepageMetric)
    private homepageMetricsRepository: Repository<HomepageMetric>,
  ) {}

  // 1. CREATE (לשימוש פנימי ע"י שירות רקע)
async create(createHomepageMetricDto: CreateHomepageMetricDto): Promise<HomepageMetric> {
    
    // 🛑 התיקון הסופי: שימוש באובייקט Relationship להעברת ה-ID.
    // זה מכריח את TypeORM לשמור את המפתח הזר (category_id) כראוי.
    const newMetric = this.homepageMetricsRepository.create({
        category: { id: createHomepageMetricDto.category_id } as Category, // ✅ זהו השינוי הקריטי
        
        week_start: new Date(createHomepageMetricDto.week_start), 
        joins_count: createHomepageMetricDto.joins_count,
        gmv: createHomepageMetricDto.gmv,
    });

    return this.homepageMetricsRepository.save(newMetric);
}
  // 2. READ ALL (שליפת כל המדדים)
  async findAll(): Promise<HomepageMetric[]> {
    return this.homepageMetricsRepository.find({
        // שליפת הקטגוריה המקושרת
        relations: ['category'],
        // סידור מהחדש לישן
        order: { week_start: 'DESC' }
    });
  }

  // 3. READ ONE
  async findOne(id: number): Promise<HomepageMetric> {
    const metric = await this.homepageMetricsRepository.findOne({ 
      where: { id },
      relations: ['category']
    });
    
    // id הוא integer בטבלה זו
    if (!metric) {
        throw new NotFoundException(`Homepage Metric with ID ${id} not found`);
    }
    return metric;
  }
  
  // 🛑 אין פונקציות UPDATE או DELETE
}