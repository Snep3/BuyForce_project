import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { HomepageMetricsService } from './homepage_metrics.service'; 
import { HomepageMetric } from '../entities/homepage_metrics.entity'; 
import { CreateHomepageMetricDto } from './dto/create-homepage-metric.dto'; 
import { CurrentMetricsDto } from './dto/current-metrics.dto'; // 🔑 ייבוא DTO החדש

@Controller('homepage-metrics') 
@UseInterceptors(ClassSerializerInterceptor) // 🔑 הפעלת ה-Interceptor ברמת ה-Controller
export class HomepageMetricsController {
  constructor(private readonly homepageMetricsService: HomepageMetricsService) {} 
  
  // ----------------------------------------------------------------------
  // 🟢 הוספה: ENDPOINT ל-Web/App (Flow G) - שליפת המדדים העדכניים
  // ----------------------------------------------------------------------
  
  // GET /homepage-metrics/current-metrics
  @Get('current-metrics')
  @SerializeOptions({ type: CurrentMetricsDto }) // 🔑 שימוש ב-DTO הקל משקל
  async getCurrentMetrics(): Promise<CurrentMetricsDto> {
    // הפונקציה ב-Service מחזירה DTO מלא המכיל את כל הנתונים הנדרשים ל-Frontend
    return this.homepageMetricsService.getCurrentMetrics();
  }

  // ----------------------------------------------------------------------
  // --- Endpoints קיימים (מיועדים ל-Admin/פנימי) ---
  // ----------------------------------------------------------------------

  // POST /homepage-metrics (לשימוש פנימי, למשל, משירות רקע)
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createHomepageMetricDto: CreateHomepageMetricDto): Promise<HomepageMetric> {
    return this.homepageMetricsService.create(createHomepageMetricDto);
  }

  // GET /homepage-metrics
  @Get()
  findAll(): Promise<HomepageMetric[]> {
    return this.homepageMetricsService.findAll();
  }

  // GET /homepage-metrics/:id
  @Get(':id')
  findOne(@Param('id') id: number): Promise<HomepageMetric> {
    return this.homepageMetricsService.findOne(id); 
  }
}