// src/product_images/dto/create-product-image.dto.ts

export class CreateProductImageDto {
  // מפתח זר לטבלת Products (חובה)
  readonly product_id: string; 
  
  // כתובת ה-URL של התמונה (חובה)
  readonly image_url: string; 
  
  // סדר הצפייה (אופציונלי, בדרך כלל מוגדר כ-0 כברירת מחדל ב-DB)
  readonly sort_order?: number; 
  
  // id, created_at נוצרים אוטומטית.
}