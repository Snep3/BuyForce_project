// src/notifications/dto/create-notification.dto.ts

export class CreateNotificationDto {
  // המשתמש המקבל (מפתח זר)
  readonly user_id: string; 
  
  // סוג ההתראה (למשל: 'GROUP_JOINED', 'PAYMENT_FAILED')
  readonly type: string; 
  
  // הכותרת/שורת הנושא (למשל, עבור אימייל)
  readonly title: string; 
  
  // גוף ההודעה (טקסט ראשי)
  readonly body: string; 
  
  // נתונים נוספים (JSONB)
  readonly payload?: Record<string, any>; 
  
  // ערוץ השליחה (למשל: 'push', 'email', 'in_app')
  readonly channel: string; 
  
  // הסטטוס ההתחלתי (למשל: 'PENDING')
  readonly status: string; 
  
  // error_message, created_at, sent_at נוצרים אוטומטית או לא נשלחים ב-DTO.
}