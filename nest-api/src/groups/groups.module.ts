// src/groups/groups.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember])],
  controllers: [GroupsController], // 👈 כאן לוודא
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
