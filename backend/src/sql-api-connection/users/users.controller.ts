import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'רישום משתמש חדש' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'שליפת משתמש פעיל לפי ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOneActive(id);
    return UserResponseDto.fromEntity(user);
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'עדכון פרטי משתמש (כולל סיסמה)' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateDto);
    return UserResponseDto.fromEntity(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'מחיקת משתמש (מחיקה רכה - Soft Delete)' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}