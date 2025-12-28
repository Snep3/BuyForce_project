// src/groups/groups.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('api/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // ראוט בדיקה קטן – לוודא שהמודול חי
  @Get('ping')
  ping() {
    return { ok: true };
  }

  // החזרת קבוצה לפי productId
  @Get('by-product/:productId')
  async getByProduct(@Param('productId') productId: string) {
    const group = await this.groupsService.findByProduct(productId);
    // אם אין קבוצה – נחזיר null (200 עם null)
    return group;
  }
}
