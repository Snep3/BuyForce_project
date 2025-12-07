// src/admins/dto/create-admin.dto.ts

export class CreateAdminDto {
  // נדרש כיוון שמוגדר כ-@PrimaryColumn מסוג UUID ואינו נוצר אוטומטית.
  readonly id: string; 
  
  // המפתח הזר לטבלת users
  readonly userId: string; 
  
  // תפקיד המנהל (לדוגמה: 'super_admin', 'ops', 'support')
  readonly role: string; 
}