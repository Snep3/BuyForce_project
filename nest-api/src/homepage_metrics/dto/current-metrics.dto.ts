import { Expose } from 'class-transformer';

/**
 * DTO למדדים העדכניים ביותר המוצגים בדף הבית (Flow G)
 */
export class CurrentMetricsDto {
    @Expose()
    totalJoinsLastWeek: number; // סך ההצטרפויות בשבוע האחרון

    @Expose()
    totalGmvLastWeek: number; // סך מחזור הכספים בשבוע האחרון

    @Expose()
    // 💡 מדד מחושב שמקורו בקטגוריה ספציפית
    @Expose()
    targetReachRate: number; // אחוז הקבוצות שהגיעו ליעד (אגרגטיבי)

    @Expose()
    updatedAt: Date; // מתי המדדים חושבו לאחרונה
}