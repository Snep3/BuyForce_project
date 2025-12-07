// src/groups/groups.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../entities/groups.entity'; 
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]) // 🔑 חיבור ה-Entity
  ],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService], 
})
export class GroupsModule {}