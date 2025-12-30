import { Exclude, Expose, Transform } from 'class-transformer';

// DTO קל משקל המיועד רק לתפריטי ניווט בדף הבית ובאפליקציה.
export class CategoryNavDto {
    @Expose()
    id: number;
    
    @Expose()
    name: string;
    
    @Expose()
    slug: string;
    
    // מניח ש-iconUrl נשמר כ-Camel Case ב-Entity
    @Expose()
    iconUrl?: string;

    // --- הסתרת נתונים כבדים ומיותרים ל-UI הציבורי ---
    
    @Exclude() // מסתיר את כל המוצרים המקושרים
    products: any; 
    
    @Exclude() // שדות ניהול פנימיים
    sortOrder: number;

    @Exclude()
    createdAt: Date;
    
    @Exclude()
    updatedAt: Date;
}