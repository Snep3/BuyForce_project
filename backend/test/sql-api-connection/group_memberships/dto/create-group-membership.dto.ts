// src/group_memberships/dto/create-group-membership.dto.ts

export class CreateGroupMembershipDto {
  // המפתח הראשי (אם נוצר בצד האפליקציה)
  readonly id: string; 
  
  // מפתח זר לטבלת groups
  readonly group_id: string; 
  
  // מפתח זר לטבלת users
  readonly user_id: string; 
  
  // סטטוס התחלתי (למשל: 'PENDING_PREAUTH')
  readonly status: string; 
  
  // מחיר העסקה
  readonly amount_group_price: number; 
  
  // created_at, joined_at נוצרים אוטומטית ב-DB.
}