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
  
  // --- 🟢 קודם כל הנתיבים הסטטיים (בלי פרמטרים) ---

  // שליפת קבוצות קרובות ליעד
  @Get('near-goal')
  async getNearGoal() {
    return this.groupsService.getGroupsNearGoal();
  }

  // שליפת קבוצות פתוחות בלבד
  @Get('open')
  @SerializeOptions({ type: GroupCardDto }) 
  async findAllOpen(): Promise<GroupCardDto[]> {
    const groups = await this.groupsService.findAllByStatus('OPEN');
    return groups as unknown as GroupCardDto[]; 
  }

  // שליפת כל הקבוצות
  @Get()
  @SerializeOptions({ type: GroupCardDto })
  async findAll(): Promise<GroupCardDto[]> {
    const groups = await this.groupsService.findAll();
    return groups as unknown as GroupCardDto[]; 
  }

  // --- 🔵 עכשיו הנתיבים עם פרמטרים (:id) ---

  // שליפת קבוצה לפי ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Group> {
    return this.groupsService.findOne(id);
  }

  // יצירת קבוצה
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  // הצטרפות לקבוצה
  @Post(':id/join')
  async joinGroup(@Param('id') id: string) {
    return this.groupsService.incrementJoinedCount(id);
  }

  // עדכון קבוצה
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateGroupDto: UpdateGroupDto
  ): Promise<Group> {
    return this.groupsService.update(id, updateGroupDto);
  }

  // מחיקת קבוצה
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
}