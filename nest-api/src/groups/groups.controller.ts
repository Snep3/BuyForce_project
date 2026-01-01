// src/groups/groups.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('ping')
  ping() {
    return { ok: true };
  }

  // קבוצות לפי מוצר – לשימוש בדף פרטי מוצר
  @Get('by-product/:productId')
  async getGroupsByProduct(@Param('productId') productId: string) {
    return this.groupsService.findByProduct(productId);
  }

  // הקבוצות שהמשתמש שייך אליהן – לדף "הקבוצות שלי"
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyGroups(@Req() req: any) {
    const userId = req.user?.userId;
    return this.groupsService.getGroupsForUser(userId);
  }
}
