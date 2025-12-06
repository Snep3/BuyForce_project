// src/homepage_metrics/dto/create-homepage-metric.dto.ts

export class CreateHomepageMetricDto {
  // מפתח זר לקטגוריה
  readonly category_id: number; 
  
  // תחילת השבוע (שדה חובה)
  readonly week_start: Date; 
  
  // סך ההצטרפויות בשבוע זה
  readonly joins_count: number; 
  
  // סך שווי הסחורה (GMV) שנוצר
  readonly gmv: number; 
  
  // id ו-created_at נוצרים אוטומטית.
}