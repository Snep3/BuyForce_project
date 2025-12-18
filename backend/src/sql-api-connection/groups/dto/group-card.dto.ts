import { Exclude, Expose, Transform } from 'class-transformer';
import { Group } from '../../entities/groups.entity'; // הנחה: Entity קיים
// 🔑 נניח שיש לנו ProductDetailsDto מודול המוצרים

export class GroupCardDto {
    @Expose()
    id: string;

    // 💡 משיכת נתונים מחוברים (Product)
    @Expose()
    @Transform(({ obj }) => obj.product?.name)
    productName: string;

    @Expose()
    @Transform(({ obj }) => obj.product?.imageUrl)
    productImageUrl: string;

    @Expose()
    status: string;
    
    // 🔑 נתונים חיוניים לכרטיס (Card)
    @Expose()
    targetMembers: number;
    
    // נניח שיש שדה joinedCount ב-Group Entity
    @Expose()
    joinedCount: number; // 🚨 הערה: וודא שזה קיים ב-Entity

    @Expose()
    deadline: Date;

    // --------------------------------------------------------
    // 🟢 הנתון המחושב הקריטי ל-UI
    // --------------------------------------------------------
    @Expose()
    @Transform(({ obj }) => {
        if (!obj.targetMembers || obj.targetMembers === 0) return 0;
        // חישוב אחוז ההתקדמות (joinedCount / targetMembers) * 100
        const percent = (obj.joinedCount / obj.targetMembers) * 100;
        return Math.min(100, Math.round(percent)); // מוגבל ל-100%
    })
    progressPercent: number;
    // --------------------------------------------------------

    // --- הסתרת שדות ניהוליים ---
    @Exclude()
    productId: string;

    @Exclude()
    maxMembers: number;
    
    @Exclude()
    transactions: any; // הסתרת פרטי טרנזקציות רגישים
}