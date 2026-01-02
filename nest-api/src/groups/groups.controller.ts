import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, SerializeOptions, BadRequestException } from '@nestjs/common';
import { GroupsService } from './groups.service'; 
import { Group } from '../groups/group.entity'; 
import { CreateGroupDto } from './dto/create-group.dto'; 
import { UpdateGroupDto } from './dto/update-group.dto'; 
import { GroupCardDto } from './dto/group-card.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor) 
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {} 
  
  @Get('near-goal')
  async getNearGoal() {
    return this.groupsService.getNearGoalGroups();
  }

  @Get('open')
  @SerializeOptions({ type: GroupCardDto }) 
  async findAllOpen(): Promise<GroupCardDto[]> {
    const groups = await this.groupsService.findAllByStatus('OPEN');
    return groups as unknown as GroupCardDto[]; 
  }

  @Get()
  @SerializeOptions({ type: GroupCardDto })
  async findAll(): Promise<GroupCardDto[]> {
    const groups = await this.groupsService.findAll();
    return groups as unknown as GroupCardDto[]; 
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Group> {
    return this.groupsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  /**
   * Endpoint הצטרפות מעודכן
   * מקבל groupId מהנתיב ו-userId מה-Body
   */
  @Post(':id/join')
  async joinGroup(
    @Param('id') id: string,
    @Body('userId') userId: string
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required to join a group');
    }
    return this.groupsService.joinGroup(id, userId);
  }

  /**
   * Endpoint עזיבת קבוצה
   */
  @Post(':id/leave')
  async leaveGroup(
    @Param('id') id: string,
    @Body('userId') userId: string
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required to leave a group');
    }
    return this.groupsService.leaveGroup(id, userId);
  }
  @UseGuards(JwtAuthGuard)
@Get('user/my-groups') // <--- הנתיב הסטטי חייב להיות ראשון!
async getMyGroups(@Req() req: any) {
  const userId = req.user?.id || req.user?.userId; 
  return this.groupsService.findGroupsByUser(userId);
}

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<Group> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
  /**
   * החזרת כל הקבוצות שמשתמש ספציפי חבר בהן
   */
  @Get('user/:userId')
  async findGroupsByUserId(@Param('userId') userId: string) {
    return this.groupsService.findGroupsByUser(userId);
  }

}