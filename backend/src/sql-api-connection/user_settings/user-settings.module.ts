import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
// ✅ תיקון נתיב: יציאה בודדת (../)
import { UserSetting } from '../entities/user_settings.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSetting]),
  ],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService], 
})
export class UserSettingsModule {}