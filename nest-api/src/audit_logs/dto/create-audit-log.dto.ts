// src/audit_logs/dto/create-audit-log.dto.ts (הקוד המתוקן)

import { IsUUID, IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // עבור שדה ה-JSONB

export class CreateAuditLogDto {
  
  // 1. המפתח הזר לאדמין
  // נדרש: שדה חובה, UUID
  @IsNotEmpty()
  @IsUUID()
  readonly adminId: string; // ⬅️ שונה ל-adminId (CamelCase)
  
  // 2. סוג הפעולה
  // נדרש: שדה חובה, מחרוזת
  @IsNotEmpty()
  @IsString()
  readonly action: string; 
  
  // 3. סוג היעד (לדוגמה: 'product', 'user')
  // נדרש: שדה חובה, מחרוזת
  @IsNotEmpty()
  @IsString()
  readonly targetType: string; // ⬅️ שונה ל-targetType (CamelCase)
  
  // 4. ה-ID של היעד (ה-UUID של המשתמש/מוצר ששונה)
  // נדרש: שדה חובה, UUID
  @IsNotEmpty()
  @IsUUID()
  readonly targetId: string; // ⬅️ שונה ל-targetId (CamelCase)
  
  // 5. פרטי האירוע (JSONB)
  // אופציונלי, אובייקט (JSON)
  @IsOptional()
  @IsObject()
  @Type(() => Object) // או פשוט any, אך Type מומלץ לאובייקטים מורכבים
  readonly details?: any; 
}