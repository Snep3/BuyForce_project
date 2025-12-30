// src/admin/groups/admin-groups.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';
import { GroupsService } from '../../groups/groups.service';
import { CreateGroupDto } from '../../groups/dto/create-group.dto';
import { UpdateGroupDto } from '../../groups/dto/update-group.dto';
@Controller('api/admin/groups')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminGroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list() {
    return this.groupsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
