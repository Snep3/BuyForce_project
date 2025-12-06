// src/sql-api-connection/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ✅ ייבוא ה-Entity הנכון
import { User } from '../entities/users.entity'; // תיקון סופי של הנתיב
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    // ✅ רישום ה-Entity עבור מודול ספציפי
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule], // חשוב לייצא את ה-Service
})
export class UsersModule {}