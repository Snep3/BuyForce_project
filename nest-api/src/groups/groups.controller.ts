import { 
  Controller, Get, Post, Put, Delete, Param, Body,Req, 
  HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, 
  SerializeOptions, UseGuards, Request 
} from '@nestjs/common';
import { GroupsService } from './groups.service'; 
import { Group } from '../groups/group.entity'; 
import { CreateGroupDto } from './dto/create-group.dto'; 
import { UpdateGroupDto } from './dto/update-group.dto'; 
import { GroupCardDto } from './dto/group-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // ייבוא ה-Guard לאימות המשתמש

@Controller('groups') // שינינו חזרה ל-groups כדי להתאים לפרונטאנד המקורי שלך
@UseInterceptors(ClassSerializerInterceptor) 
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {} 
  

  
  // --- 🟢 קודם כל הנתיבים הסטטיים (בלי פרמטרים) ---

  @Get('near-goal')
  async getNearGoal() {
    return this.groupsService.getGroupsNearGoal();
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
  // בתוך GroupsController

@UseGuards(JwtAuthGuard)
@Get('user/my-groups') // הנתיב יהיה: /groups/user/my-groups
async getMyGroups(@Req() req) {
  const userId = req.user?.id || req.user?.userId;
  return this.groupsService.findUserGroups(userId);
}

  // --- 🔵 עכשיו הנתיבים עם פרמטרים (:id) ---

@Get(':id')
async findOne(@Param('id') id: string, @Req() req) {
  // אנחנו מנסים לחלץ את ה-ID מהטוקן אם המשתמש מחובר
  const userId = req.user?.id || req.user?.userId;
  return this.groupsService.findOne(id, userId);
}

  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  // הצטרפות לקבוצה - מתוקן עם אימות ושליחת userId
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinGroup(@Param('id') id: string, @Request() req) {
    // שליפת ה-userId מהטוקן (מנסה את שני המבנים הנפוצים)
    const userId = req.user?.id || req.user?.userId;
    
    // פתרון השגיאה: שליחת ה-id וה-userId כפי שה-Service מצפה
    return this.groupsService.incrementJoinedCount(id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateGroupDto: UpdateGroupDto
  ): Promise<Group> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }


  @Post(':id/leave')
@UseGuards(JwtAuthGuard) // וודא שהמשתמש מחובר
async leave(@Param('id') id: string, @Req() req) {
  const userId = req.user.id; // משיכת ה-ID מהטוקן
  return this.groupsService.leaveGroup(id, userId);
}
  
}