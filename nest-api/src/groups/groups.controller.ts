import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { GroupsService } from './groups.service'; 
import { Group } from '../groups/group.entity'; 
import { CreateGroupDto } from './dto/create-group.dto'; 
import { UpdateGroupDto } from './dto/update-group.dto'; 
import { GroupCardDto } from './dto/group-card.dto';
@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor) 
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {} 
  
  // ----------------------------------------------------------------------
  // 🟢 Endpoints אופטימליים ל-Web/App
  // ----------------------------------------------------------------------
  
  // GET /groups (שליפת רשימת כרטיסי קבוצות לדף הבית)
  @Get()
  @SerializeOptions({ type: GroupCardDto })
  async findAll(): Promise<GroupCardDto[]> {
    const groups = await this.groupsService.findAll();
    // 🟢 תיקון שגיאה TS2352: המרה כפולה (as unknown as GroupCardDto[])
    return groups as unknown as GroupCardDto[]; 
  }

  // GET /groups/open (הוספת סינון לקבוצות פתוחות בלבד)
  @Get('open')
  @SerializeOptions({ type: GroupCardDto }) 
  async findAllOpen(): Promise<GroupCardDto[]> {
    const groups = await this.groupsService.findAllByStatus('OPEN');
    // 🟢 תיקון שגיאה TS2352: המרה כפולה (as unknown as GroupCardDto[])
    return groups as unknown as GroupCardDto[]; 
  }
  
  // ----------------------------------------------------------------------
  // --- Endpoints CRUD קיימים ---
  // ----------------------------------------------------------------------
  
  // POST /groups
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
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