// src/admins/dto/update-admin.dto.ts

export class UpdateAdminDto {
  // מוגדר כאופציונלי (?). לא ניתן לשנות את ה-id או userId לאחר יצירת האדמין.
  readonly role?: string; 
}