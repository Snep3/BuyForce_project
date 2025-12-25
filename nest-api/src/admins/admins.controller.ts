// src/admins/admins.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminsService } from './admins.service'; 
import { Admin } from './admins.entity'; 
import { CreateAdminDto } from './dto/create-admin.dto'; 
import { UpdateAdminDto } from './dto/update-admin.dto'; 
import { AdminResponseDto } from './dto/admin-response.dto';

@Controller('admins') // ✅ הנתיב הראשי של ה-API: /admins
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {} 
  
  // POST /admins
  @Post()
  @HttpCode(HttpStatus.CREATED) 
    // 💡 הערה: אם אתה משתמש ב-Global Validation Pipe, אפשר להסיר את השורה הבאה
    // @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> { 
        
        // --- CONTROLLER DEBUG 5: בדיקה אם הבקשה הגיעה לכאן ---
        console.log("--- CONTROLLER DEBUG 5: Request received by Controller ---");
        console.log("--- DTO received: ", createAdminDto);

    const admin = await this.adminsService.create(createAdminDto);
        
        // --- CONTROLLER DEBUG 6: בדיקה אם ה-Service החזיר Entity ---
        console.log("--- CONTROLLER DEBUG 6: Entity returned from Service ---");

    return AdminResponseDto.fromEntity(admin); 
  }

  // GET /admins
  @Get()
  async findAll(): Promise<AdminResponseDto[]> { 
    const admins = await this.adminsService.findAll();
    return admins.map(admin => AdminResponseDto.fromEntity(admin)); 
  }

  // GET /admins/:id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> { 
    const admin = await this.adminsService.findOne(id);
    return AdminResponseDto.fromEntity(admin); 
  }

  // PUT /admins/:id
  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateAdminDto: UpdateAdminDto
  ): Promise<AdminResponseDto> { 
    const admin = await this.adminsService.update(id, updateAdminDto);
    return AdminResponseDto.fromEntity(admin); 
  }

  // DELETE /admins/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.adminsService.remove(id);
  }
}