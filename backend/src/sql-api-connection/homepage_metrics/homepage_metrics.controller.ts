// src/homepage_metrics/homepage_metrics.controller.ts

import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { HomepageMetricsService } from './homepage_metrics.service'; 
import { HomepageMetric } from '../entities/homepage_metrics.entity'; 
import { CreateHomepageMetricDto } from './dto/create-homepage-metric.dto'; 

@Controller('homepage-metrics') 
export class HomepageMetricsController {
  constructor(private readonly homepageMetricsService: HomepageMetricsService) {} 
  
  // POST /homepage-metrics (לשימוש פנימי)
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
    // ה-id הוא number לפי ה-DB
    return this.homepageMetricsService.findOne(id); 
  }
}