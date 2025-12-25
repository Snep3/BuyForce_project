import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageMetric } from './homepage_metrics.entity';
import { CreateHomepageMetricDto } from './dto/create-homepage-metric.dto';
import { CurrentMetricsDto } from './dto/current-metrics.dto'; // 🔑 ייבוא DTO החדש
import { Category } from '../categories/categories.entity';

@Injectable()
export class HomepageMetricsService {
  constructor(
    @InjectRepository(HomepageMetric)
    private homepageMetricsRepository: Repository<HomepageMetric>,
  ) {}
    
    // ----------------------------------------------------------------------
    // 🟢 פונקציה חדשה: שליפת המדדים העדכניים (Flow G)
    // ----------------------------------------------------------------------
    async getCurrentMetrics(): Promise<CurrentMetricsDto> {
        // 1. מציאת השבוע האחרון
        const latestMetrics = await this.homepageMetricsRepository.find({
            order: { week_start: 'DESC' },
            take: 1, // רק השורה האחרונה (העדכנית ביותר)
            // 💡 ניתן להוסיף כאן relations: ['category'] אם רוצים להציג את פרטי הקטגוריה העדכנית ב-DTO הזה
        });
        
        if (latestMetrics.length === 0) {
            // במקרה שאין מדדים כלל, נחזיר ערכי אפס
            return {
                totalJoinsLastWeek: 0,
                totalGmvLastWeek: 0,
                targetReachRate: 0,
                updatedAt: new Date(0), 
            };
        }

        const latest = latestMetrics[0];

        // 2. יצירת ה-DTO המאוחד
        return {
            totalJoinsLastWeek: latest.joins_count,
            totalGmvLastWeek: latest.gmv,
            // 🚨 MOCK: יש להחליף בערך מחושב או נשמר ב-Entity
            targetReachRate: 75, 
            updatedAt: latest.week_start,
        };
    }

  // 1. CREATE (לשימוש פנימי ע"י שירות רקע)
    async create(createHomepageMetricDto: CreateHomepageMetricDto): Promise<HomepageMetric> {
    
    // 🛑 התיקון הסופי: שימוש באובייקט Relationship להעברת ה-ID.
    const newMetric = this.homepageMetricsRepository.create({
        category: { id: createHomepageMetricDto.category_id } as Category, 
        
        week_start: new Date(createHomepageMetricDto.week_start), 
        joins_count: createHomepageMetricDto.joins_count,
        gmv: createHomepageMetricDto.gmv,
    });

    return this.homepageMetricsRepository.save(newMetric);
    }
    
  // 2. READ ALL (שליפת כל המדדים)
  async findAll(): Promise<HomepageMetric[]> {
    return this.homepageMetricsRepository.find({
        // 🥇 תיקון: טעינת היחס 'category'
        relations: ['category'],
        // סידור מהחדש לישן
        order: { week_start: 'DESC' }
    });
  }

  // 3. READ ONE
  async findOne(id: number): Promise<HomepageMetric> {
    const metric = await this.homepageMetricsRepository.findOne({ 
      where: { id },
      // 🥇 תיקון: טעינת היחס 'category'
      relations: ['category']
    });
    
    if (!metric) {
        throw new NotFoundException(`Homepage Metric with ID ${id} not found`);
    }
    return metric;
  }
  
  // 🛑 אין פונקציות UPDATE או DELETE
}