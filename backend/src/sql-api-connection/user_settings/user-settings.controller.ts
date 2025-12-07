import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('user-settings')
// הניתוב משלב את userId כחלק מהנתיב
@Controller('users/:userId/settings') 
export class UserSettingsController {
  constructor(private readonly settingsService: UserSettingsService) {}

  // 1. POST: יצירה ראשונית (או שימוש כ-UPSERT)
  @Post()
  @ApiOperation({ summary: 'יוצר הגדרות משתמש או מעדכן אותן אם קיימות' })
  async createOrUpdate(
      @Param('userId') userId: string, 
      @Body() updateDto: CreateUserSettingDto
  ) {
    return this.settingsService.upsert(userId, updateDto);
  }

  // 2. GET: שליפת הגדרות משתמש
  @Get()
  @ApiOperation({ summary: 'שליפת הגדרות משתמש לפי UUID' })
  async findOne(@Param('userId') userId: string) {
    return this.settingsService.findOne(userId);
  }
  
  // 3. PATCH: עדכון חלקי של הגדרות קיימות
  @Patch()
  @ApiOperation({ summary: 'עדכון חלקי של הגדרות משתמש קיימות' })
  async update(
      @Param('userId') userId: string, 
      @Body() updateDto: UpdateUserSettingDto
  ) {
    return this.settingsService.upsert(userId, updateDto);
  }
}