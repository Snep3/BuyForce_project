// src/groups/dto/create-group.dto.ts

import { IsUUID, IsString, IsInt, IsDateString, IsIn, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @IsUUID() 
  @IsNotEmpty()
  readonly id: string; 
  
  @IsUUID()
  @IsNotEmpty()
  readonly productId: string; // ✅ Camel Case
  
  @IsIn(['DRAFT', 'OPEN', 'REACHED_TARGET', 'LOCKED', 'CHARGED', 'FAILED', 'REFUNDED']) 
  @IsNotEmpty()
  readonly status: string; 
  
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  // 🛑 וודא שזה targetMembers ולא target_members
  readonly targetMembers: number; // ✅ Camel Case
  
  @IsDateString()
  @IsNotEmpty()
  readonly deadline: Date; 

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  // 🛑 וודא שזה maxMembers ולא max_members
  readonly maxMembers: number; // ✅ Camel Case
}