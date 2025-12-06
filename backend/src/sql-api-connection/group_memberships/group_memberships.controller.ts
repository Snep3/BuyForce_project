// src/group_memberships/group_memberships.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GroupMembershipsService } from './group_memberships.service'; 
import { GroupMembership } from '../entities/group_memberships.entity'; 
import { CreateGroupMembershipDto } from './dto/create-group-membership.dto'; 
import { UpdateGroupMembershipDto } from './dto/update-group-membership.dto'; 

@Controller('group-memberships') // ✅ הנתיב הראשי של ה-API: /group-memberships
export class GroupMembershipsController {
  constructor(private readonly groupMembershipsService: GroupMembershipsService) {} 
  
  // POST /group-memberships
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createGroupMembershipDto: CreateGroupMembershipDto): Promise<GroupMembership> {
    return this.groupMembershipsService.create(createGroupMembershipDto);
  }

  // GET /group-memberships
  @Get()
  findAll(): Promise<GroupMembership[]> {
    return this.groupMembershipsService.findAll();
  }

  // GET /group-memberships/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<GroupMembership> {
    return this.groupMembershipsService.findOne(id);
  }

  // PUT /group-memberships/:id
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateGroupMembershipDto: UpdateGroupMembershipDto
  ): Promise<GroupMembership> {
    return this.groupMembershipsService.update(id, updateGroupMembershipDto);
  }

  // DELETE /group-memberships/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.groupMembershipsService.remove(id);
  }
}