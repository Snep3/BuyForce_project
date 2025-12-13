// src/group_memberships/dto/create-group-membership.dto.ts

import { IsUUID, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateGroupMembershipDto {

  @IsUUID()
  @IsNotEmpty()
  readonly groupId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amountGroupPrice: number;
}
