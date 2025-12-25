// src/notifications/dto/create-notification.dto.ts

import { 
    IsUUID, 
    IsNotEmpty, 
    IsString, 
    IsOptional, 
    IsEnum, 
    IsObject, 
    MaxLength 
} from 'class-validator';
import { Type } from 'class-transformer';

// 💡 דוגמה ל-Enums (מומלץ להגדיר אותם בקובץ נפרד)
enum NotificationChannel { PUSH = 'push', EMAIL = 'email', IN_APP = 'in_app' }
enum NotificationStatus { PENDING = 'PENDING', SENT = 'SENT', FAILED = 'FAILED' }
// אפשר להגדיר גם NotificationType באופן דומה

export class CreateNotificationDto {
    
    // 1. user_id (UUID, מפתח זר)
    @IsNotEmpty()
    @IsUUID() // ✅ מוודא שמדובר ב-UUID תקין
    readonly user_id: string;
    
    // 2. type (מחרוזת)
    @IsNotEmpty()
    @IsString()
    @MaxLength(50) // תואם ל-length 50 ב-Entity
    readonly type: string;
    
    // 3. title
    @IsNotEmpty()
    @IsString()
    @MaxLength(255) // תואם ל-length 255 ב-Entity
    readonly title: string;
    
    // 4. body
    @IsNotEmpty()
    @IsString()
    readonly body: string; // text ב-DB
    
    // 5. payload (jsonb)
    @IsOptional()
    @IsObject() 
    @Type(() => Object) 
    readonly payload?: Record<string, any>;
    
    // 6. channel
    @IsNotEmpty()
    @IsEnum(NotificationChannel)
    readonly channel: NotificationChannel; 
    
    // 7. status
    @IsNotEmpty()
    @IsEnum(NotificationStatus)
    readonly status: NotificationStatus;
    
    // שדות כמו created_at, sent_at ו-error_message לא נכללים כאן כי הם מנוהלים על ידי המערכת.
}