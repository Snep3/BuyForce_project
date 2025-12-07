// src/admins/admins.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../entities/admins.entity'; 
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]) // 🔑 חיבור ה-Entity
  ],
  providers: [AdminsService],
  controllers: [AdminsController],
  exports: [AdminsService], 
})
export class AdminsModule {}