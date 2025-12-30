import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { CreateUserSettingDto } from './dto/create-user-setting.dto'; 
import { UpdateUserSettingDto } from './dto/update-user-setting.dto'; 
// ✅ תיקון נתיב: יציאה בודדת (../)
import { UserSetting } from './user_settings.entity'; 

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSetting)
    private settingsRepository: Repository<UserSetting>,
  ) {}

  // 1. UPSERT: יצירה או עדכון של הגדרות משתמש לפי userId
  async upsert(userId: string, updateDto: CreateUserSettingDto | UpdateUserSettingDto): Promise<UserSetting> {
    
    // בדיקה אם ההגדרות כבר קיימות
    let settings = await this.settingsRepository.findOne({ where: { userId } as any });
    
    // מכינים את הנתונים לעדכון/יצירה
    const payload = { 
        ...updateDto, 
        userId: userId 
    };

    if (settings) {
      // עדכון הגדרות קיימות
      const mergedSettings = this.settingsRepository.merge(settings, payload);
      // שימוש ב-as any כדי לעקוף שגיאות טיפוס נפוצות (TS2769/TS2740)
      return await this.settingsRepository.save(mergedSettings as any);
    } 
    
    // יצירה: אם לא קיים
    const newSettings = this.settingsRepository.create(payload);
    return await this.settingsRepository.save(newSettings as any);
  }
  
  // 2. READ: שליפת הגדרות לפי userId
  async findOne(userId: string): Promise<UserSetting> {
    const settings = await this.settingsRepository.findOne({ 
      where: { userId } as any
    });
    
    if (!settings) {
        throw new NotFoundException(`Settings for user ID ${userId} not found`);
    }
    return settings;
  }
}