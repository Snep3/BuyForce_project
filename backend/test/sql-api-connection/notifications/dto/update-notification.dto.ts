// src/notifications/dto/update-notification.dto.ts

export class UpdateNotificationDto {
  // @IsOptional()
  // @IsIn(['PENDING', 'SENT', 'FAILED', 'READ'])
  readonly status?: string; 
  
  // מועד השליחה (אם התעדכן בהצלחה)
  readonly sent_at?: Date; 
  
  // הודעת שגיאה (אם נכשלה)
  readonly error_message?: string;
}