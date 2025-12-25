// src/product_performance/dto/product-metrics.dto.ts

import { Expose } from 'class-transformer';

/**
 * DTO להצגת מדדי ביצועים למוצר (לשימוש ב-Frontend)
 */
export class ProductMetricsDto {
    // המדדים הקיימים
    @Expose()
    views7d: number;

    @Expose()
    joins7d: number;

    @Expose()
    wishlistAdds7d: number;

    @Expose()
    conversionRate: number;

    // שדות נוספים מה-Entity (אם יש)
    @Expose()
    lastUpdated: Date; 
}