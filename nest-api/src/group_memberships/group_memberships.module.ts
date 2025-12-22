// src/group_memberships/group_memberships.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMembership } from './group_memberships.entity'; 
import { GroupMembershipsService } from './group_memberships.service';
import { GroupMembershipsController } from './group_memberships.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMembership]) // 🔑 חיבור ה-Entity
  ],
  providers: [GroupMembershipsService],
  controllers: [GroupMembershipsController],
  exports: [GroupMembershipsService], 
})
export class GroupMembershipsModule {}