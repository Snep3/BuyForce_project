import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity'; // מוודא ייבוא של ה-Entity ולא ה-Schema
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    // החלפת MongooseModule ב-TypeOrmModule עבור ישות המשתמש
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    UsersService, 
    JwtAuthGuard
  ],
  controllers: [UsersController],
  exports: [UsersService], // חשוב לייצא כדי שה-AuthService יוכל להשתמש בו
})
export class UsersModule {}