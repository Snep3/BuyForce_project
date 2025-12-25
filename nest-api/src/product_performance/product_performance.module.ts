import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPerformanceService } from './product_performance.service';
import { ProductPerformanceController } from './product_performance.controller';
import { ProductPerformance } from './product_performance.entity'; // ייבוא ה-Entity

@Module({
  imports: [
    // חיבור ה-Entity למודול
    TypeOrmModule.forFeature([ProductPerformance]),
  ],
  controllers: [ProductPerformanceController],
  providers: [ProductPerformanceService],
  exports: [ProductPerformanceService], // אם מודולים אחרים צריכים לגשת לביצועים
})
export class ProductPerformanceModule {}