// src/admins/dto/create-admin.dto.ts

import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
// ⚠️ הייבוא של Type נמחק 

export class CreateAdminDto {
  
  // המפתח הזר לטבלת users
  @IsNotEmpty() 
  @IsUUID()
  // ⚠️ הוסר: @Type(() => String) 
  readonly userId: string; 
  
  // תפקיד המנהל 
  @IsNotEmpty() 
  @IsString()
  // ⚠️ הוסר: @Type(() => String) 
  readonly role: string; 
}