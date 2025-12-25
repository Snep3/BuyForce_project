// src/homepage_metrics/homepage_metrics.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomepageMetric } from './homepage_metrics.entity'; // ⬅️ כנראה השורה הבעייתית
import { HomepageMetricsService } from './homepage_metrics.service';
import { HomepageMetricsController } from './homepage_metrics.controller'; 
import { CategoriesModule } from '../categories/categories.module'; // תלות אפשרית

@Module({
  imports: [
    TypeOrmModule.forFeature([HomepageMetric]),
    // אם ה-Service צריך להשתמש ב-CategoriesService, יש לייבא את המודול שלו
    CategoriesModule 
  ],
  providers: [HomepageMetricsService],
  controllers: [HomepageMetricsController],
  exports: [HomepageMetricsService], 
})
export class HomepageMetricsModule {}