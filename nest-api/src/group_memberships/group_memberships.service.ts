import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMembership } from './group_memberships.entity';
import { CreateGroupMembershipDto } from './dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from './dto/update-group-membership.dto';

// 🔑 הנחה: נדרש לייבא את GroupsService כדי לבדוק סטטוס קבוצה ולעדכן joinedCount.
// import { GroupsService } from '../../groups/groups.service'; 

@Injectable()
export class GroupMembershipsService {
  constructor(
    @InjectRepository(GroupMembership)
    private groupMembershipsRepository: Repository<GroupMembership>,
    // @Inject(GroupsService) private groupsService: GroupsService, // דרוש הזרקה
  ) {}

  // ----------------------------------------------------------------------
  // 🟢 פונקציה 1: טיפול בהצטרפות לקבוצה (Flow A)
  // ----------------------------------------------------------------------
  
  async handleGroupJoin(groupId: string, userId: string): Promise<GroupMembership> {
    
    // 1. בדיקת זמינות קבוצה (יבוצע באמצעות GroupsService)
    // ...
    
    // 2. בדיקה: האם המשתמש כבר חבר?
    const existing = await this.groupMembershipsRepository.findOne({ where: { groupId, userId } });
    if (existing) {
        throw new BadRequestException('User is already a member of this group.');
    }

    // 3. יצירת רשומת חברות בסטטוס PENDING_PREAUTH
    const newMembership = this.groupMembershipsRepository.create({
        groupId,
        userId,
        status: 'PENDING_PREAUTH', 
        amountGroupPrice: 1400.00, // MOCK!
    });
    const savedMembership = await this.groupMembershipsRepository.save(newMembership);

    // 4. הפעלת תהליך תשלום אסינכרוני
    // ...

    // 5. עדכון מונה הקבוצה
    // ...

    return savedMembership;
  }

  // ----------------------------------------------------------------------
  // 🟢 פונקציה 2: שליפת הקבוצות של המשתמש (Flow E)
  // ----------------------------------------------------------------------

  async findGroupsByUserId(userId: string): Promise<GroupMembership[]> {
    return this.groupMembershipsRepository.find({
        where: { userId },
        relations: ['group', 'group.product'], 
        // 🟢 תיקון שגיאה TS2353: מעבר לשימוש בשם השדה הישיר (כפי שהוא מוגדר ב-Entity)
        order: { 
            // אם createdAt מוגדר ב-Entity:
            // createdAt: 'DESC' 
            // אם לא: ניתן להשתמש ב-id (שכן ה-UUID הוא כרונולוגי במידה מסוימת)
            // או:
            id: 'DESC' 
        }
    });
  }

  // ----------------------------------------------------------------------
  // --- פונקציות CRUD קיימות ---
  // ----------------------------------------------------------------------

  // CREATE (נשאר לשימוש פנימי או Admin)
  async create(createGroupMembershipDto: CreateGroupMembershipDto): Promise<GroupMembership> {
    const newMembership = this.groupMembershipsRepository.create(createGroupMembershipDto);
    return this.groupMembershipsRepository.save(newMembership);
  }
  
  async findAll(): Promise<GroupMembership[]> {
    return this.groupMembershipsRepository.find({ relations: ['user', 'group'] });
  }

  async findOne(id: string): Promise<GroupMembership> {
    const membership = await this.groupMembershipsRepository.findOne({
      where: { id },
      relations: ['user', 'group', 'transaction'],
    });
    if (!membership) {
      throw new NotFoundException(`Group Membership with ID ${id} not found`);
    }
    return membership;
  }

  // 🟢 תיקון שגיאה TS2355: השלמת לוגיקת העדכון והחזרת הערך
  async update(id: string, updateGroupMembershipDto: UpdateGroupMembershipDto): Promise<GroupMembership> {
    const membership = await this.findOne(id);
    const updatedMembership = this.groupMembershipsRepository.merge(membership, updateGroupMembershipDto);
    return this.groupMembershipsRepository.save(updatedMembership);
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupMembershipsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Group Membership with ID ${id} not found`);
    }
  }
}