// src/notifications/dto/update-notification.dto.ts

import { IsOptional, IsEnum, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// 💡 נשתמש שוב ב-Enum שהגדרנו:
enum NotificationStatus { PENDING = 'PENDING', SENT = 'SENT', FAILED = 'FAILED', READ = 'READ' }


export class UpdateNotificationDto {
    
    // 1. status
    @IsOptional()
    @IsEnum(NotificationStatus) // ✅ מוודא שהערך הוא אחד מהסטטוסים המותרים
    readonly status?: NotificationStatus; 
    
    // 2. sent_at
    @IsOptional()
    @Type(() => Date) // 💡 חיוני: ממיר את המחרוזת הנכנסת ל-Date object
    @IsDate() // ✅ מוודא שמדובר בפורמט תאריך חוקי
    readonly sent_at?: Date; 
    
    // 3. error_message
    @IsOptional()
    @IsString()
    readonly error_message?: string;
}