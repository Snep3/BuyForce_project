// src/audit_logs/dto/create-audit-log.dto.ts

export class CreateAuditLogDto {
  // נניח ש-id נוצר בצד האפליקציה או DB, אך אם הוא UUID חובה, יש להוסיף אותו כאן.
  // readonly id: string; 
  
  // מפתח זר לאדמין שיצר את האירוע
  readonly admin_id: string; 
  
  // סוג הפעולה (לדוגמה: 'CREATE', 'UPDATE', 'LOGIN')
  readonly action: string; 
  
  // סוג היעד (לדוגמה: 'product', 'user', 'transaction')
  readonly target_type: string; 
  
  // ה-ID של היעד
  readonly target_id: string; 
  
  // פרטי האירוע (JSONB)
  readonly details: any; 
  
  // created_at נוצר אוטומטית ע"י TypeORM, לכן לא נדרש כאן.
}