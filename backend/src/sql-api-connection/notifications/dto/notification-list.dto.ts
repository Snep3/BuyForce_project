import { Expose, Transform } from 'class-transformer';
// 🛑 תיקון הנתיב ל-Entity (בהנחה שה-DTO בתוך תיקיית DTOs וה-Entity בתיקיית Entities בתוך src)
import { Notification } from '../../entities/notifications.entity'; 

// DTO עבור התראה בודדת ברשימה
export class NotificationItemDto {
    @Expose()
    id: string;

    @Expose()
    type: string;
    
    @Expose()
    title: string;
    
    @Expose()
    body: string;
    
    @Expose()
    @Transform(({ obj }) => obj.status === 'READ')
    isRead: boolean; // 🔑 המרה: הופך את ה-Enum הבוליאני לקריא ב-Frontend
    
    @Expose()
    createdAt: Date; 
}

/**
 * DTO מלא המכיל את רשימת ההתראות ואת המטריקות הנדרשות לפעמון
 */
export class NotificationListDto {
    @Expose()
    items: NotificationItemDto[];

    @Expose()
    unreadCount: number; // 🔑 נתון מחושב עבור אייקון הפעמון
}