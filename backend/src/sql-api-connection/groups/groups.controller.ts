// src/groups/groups.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GroupsService } from './groups.service'; 
import { Group } from '../entities/groups.entity'; 
import { CreateGroupDto } from './dto/create-group.dto'; 
import { UpdateGroupDto } from './dto/update-group.dto'; 

@Controller('groups') // ✅ הנתיב הראשי של ה-API: /groups
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {} 
  
  // POST /groups
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  // GET /groups
  @Get()
  findAll(): Promise<Group[]> {
    return this.groupsService.findAll();
  }

  // GET /groups/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Group> {
    return this.groupsService.findOne(id);
  }

  // PUT /groups/:id
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateGroupDto: UpdateGroupDto
  ): Promise<Group> {
    return this.groupsService.update(id, updateGroupDto);
  }

  // DELETE /groups/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
}