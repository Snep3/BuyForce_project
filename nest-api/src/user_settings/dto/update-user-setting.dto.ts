// src/sql-api-connection/user_settings/dto/update-user-setting.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateUserSettingDto } from './create-user-setting.dto';

// 🛑 הפתרון אם userId כבר לא קיים ב-CreateUserSettingDto
export class UpdateUserSettingDto extends PartialType(CreateUserSettingDto) {}