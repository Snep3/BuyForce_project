// src/admins/admins.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminsService } from './admins.service'; 
import { Admin } from '../entities/admins.entity'; 
import { CreateAdminDto } from './dto/create-admin.dto'; 
import { UpdateAdminDto } from './dto/update-admin.dto'; 

@Controller('admins') // ✅ הנתיב הראשי של ה-API: /admins
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {} 
  
  // POST /admins
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(createAdminDto);
  }

  // GET /admins
  @Get()
  findAll(): Promise<Admin[]> {
    return this.adminsService.findAll();
  }

  // GET /admins/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Admin> {
    return this.adminsService.findOne(id);
  }

  // PUT /admins/:id
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateAdminDto: UpdateAdminDto
  ): Promise<Admin> {
    return this.adminsService.update(id, updateAdminDto);
  }

  // DELETE /admins/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.adminsService.remove(id);
  }
}