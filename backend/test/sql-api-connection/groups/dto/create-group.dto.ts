// src/groups/dto/create-group.dto.ts

export class CreateGroupDto {
  // המפתח הראשי (אם נוצר בצד האפליקציה)
  readonly id: string; 
  
  // מפתח זר למוצר
  readonly product_id: string; 
  
  // סטטוס התחלתי (לדוגמה: 'DRAFT', 'OPEN').
  // Status check: ARRAY['DRAFT','OPEN','REACHED_TARGET', 'LOCKED', 'CHARGED', 'FAILED', 'REFUNDED']
  readonly status: string; 
  
  // כמות המשתתפים הנדרשת
  readonly target_members: number; 
  
  // המועד האחרון להצטרפות
  readonly deadline: Date; 
  
  // joined_count ו-created_at נוצרים אוטומטית.
}