import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Req, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { GroupMembershipsService } from './group_memberships.service'; 
import { GroupMembership } from '../entities/group_memberships.entity'; 
import { CreateGroupMembershipDto } from './dto/create-group-membership.dto'; 
import { UpdateGroupMembershipDto } from './dto/update-group-membership.dto'; 
import { GroupCardDto } from '../groups/dto/group-card.dto'; 

// 🛑 הוסרו: @UseGuards והייבוא של ה-Guards
@Controller('group-memberships')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupMembershipsController {
  constructor(private readonly groupMembershipsService: GroupMembershipsService) {} 
  
  // ----------------------------------------------------------------------
  // 🟢 Endpoints לעדכון נתונים (CRUD - לשימוש פנימי/מפתחים)
  // ----------------------------------------------------------------------
  
  // POST /group-memberships/join (כעת משמש ליצירה פנימית ע"י מפתח)
  @Post('join')
  @HttpCode(HttpStatus.ACCEPTED) 
  async joinGroup(
    @Body() { groupId, userId }: CreateGroupMembershipDto, 
    @Req() req // ה-req נשאר ללא שימוש
  ): Promise<{ message: string, membershipId: string }> {
        // המפתח מעביר את ה-ID של המשתמש שיצטרף כחלק מה-Body
        const result = await this.groupMembershipsService.handleGroupJoin(groupId, userId); 
        
        return { 
            message: "Membership initiated, pending pre-authorization.",
            membershipId: result.id 
        };
  }
  
  // GET /group-memberships/user/:userId (שליפת קבוצות של משתמש ספציפי)
  @Get('user/:userId')
  @SerializeOptions({ type: GroupCardDto })
  async findGroupsByUserId(@Param('userId') userId: string): Promise<GroupCardDto[]> { 
        const memberships = await this.groupMembershipsService.findGroupsByUserId(userId);
        return memberships as unknown as GroupCardDto[];
  }
  
  // ----------------------------------------------------------------------
  // --- Endpoints CRUD קיימים (פתוחים לשימוש Admin Console או פנימי) ---
  // ----------------------------------------------------------------------
  
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