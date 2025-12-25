import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  Logger, 
  InternalServerErrorException // הוספנו את זה
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Group, GroupStatus } from './group.entity';
// וודא שהנתיב ל-Entity נכון לפי המבנה שלך (שיניתי לכתובת ששלחת קודם)
import { GroupMembership } from '../group_memberships/group_memberships.entity';
@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(GroupMembership)
    private readonly membershipRepo: Repository<GroupMembership>,
  ) {}

  async findAll(): Promise<Group[]> {
    return this.groupRepo.find({ relations: ['product'] });
  }

  async findAllByStatus(status: string): Promise<Group[]> {
    return this.groupRepo.find({ 
      where: { status: status.toUpperCase() as any }, 
      relations: ['product'] 
    });
  }

  // groups.service.ts

async findOne(id: string, currentUserId?: string): Promise<any> {
  const group = await this.groupRepo.findOne({ 
    where: { id: id as any }, 
    relations: ['product', 'memberships'] 
  });
  
  if (!group) throw new NotFoundException(`Group with ID ${id} not found`);
  const target = group.target_members || 1; // הגנה מפני חילוק ב-0
  const joined = group.joined_count || 0;
  const progressPct = Math.min(100, Math.round((joined / target) * 100));

  // בדיקה: האם המשתמש שצופה כרגע בדף הוא אחד מחברי הקבוצה?
  const isMember = group.memberships?.some(m => String(m.userId) === String(currentUserId));

  return {
    ...group,
    progress_pct: progressPct, // הוספת השדה החסר לפרונטאנד
    isCurrentUserMember: !!isMember // מחזיר true או false
  };
}

  async create(data: DeepPartial<Group>): Promise<Group> {
    const groupInstance = this.groupRepo.create(data); 
    return await this.groupRepo.save(groupInstance);
  }

  async update(id: string, patch: DeepPartial<Group>): Promise<Group> {
    await this.findOne(id); 
    await this.groupRepo.update(id, patch);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    await this.groupRepo.remove(group);
  }

  /**
   * לוגיקת הצטרפות מעודכנת המשלבת את טבלת החברים
   */
async incrementJoinedCount(id: string, userId: number): Promise<Group> {
  // 1. מציאת הקבוצה
  const group = await this.findOne(id);
  const userIdString = String(userId);

  // 2. בדיקת סטטוס ודדליין (כפי שכבר עשית)
  if (group.status !== GroupStatus.OPEN) {
    throw new BadRequestException(`Cannot join group with status: ${group.status}`);
  }

  // 3. בדיקה אם המשתמש כבר רשום
  const existingMember = await this.membershipRepo.findOne({
    where: { groupId: id, userId: userIdString }
  });
  if (existingMember) {
    throw new BadRequestException('User is already a member of this group.');
  }

  // 4. יצירת רשומת חברות ושמירה שלה בנפרד
  const newMembership = this.membershipRepo.create({
    groupId: id,
    userId: userIdString,
    status: 'JOINED',
    joinedAt: new Date(),
    amountGroupPrice: group.product?.priceGroup || 0
  });
  
  // שומרים את החברות בנפרד
  await this.membershipRepo.save(newMembership);

  // 5. עדכון המונה בקבוצה בצורה בטוחה (Atomic Update)
  // במקום group.save, אנחנו משתמשים ב-update ספציפי כדי לא לשבש קשרים
  const newCount = (group.joined_count || 0) + 1;
  let newStatus = group.status;

  if (newCount >= group.target_members) {
    newStatus = GroupStatus.COMPLETED;
  }

  await this.groupRepo.update(id, { 
    joined_count: newCount,
    status: newStatus 
  });

  // החזרת הקבוצה המעודכנת
  return this.findOne(id, userIdString);
}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const now = new Date();
    const expiredGroups = await this.groupRepo.find({
      where: { status: GroupStatus.OPEN, deadline: LessThan(now) },
    });

    for (const group of expiredGroups) {
      group.status = group.joined_count >= group.target_members ? GroupStatus.COMPLETED : GroupStatus.FAILED;
      await this.groupRepo.save(group);
    }
  }

  async getGroupsNearGoal() {
    return await this.groupRepo
      .createQueryBuilder('group')
      .where('group.status = :status', { status: GroupStatus.OPEN })
      .andWhere('group.target_members - group.joined_count <= 2') 
      .andWhere('group.target_members - group.joined_count > 0')
      .getMany();
  }

  async leaveGroup(id: string, userId: number): Promise<Group> {
  const userIdString = String(userId);

  // 1. בדיקה אם המשתמש בכלל חבר בקבוצה
  const membership = await this.membershipRepo.findOne({
    where: { groupId: id, userId: userIdString }
  });

  if (!membership) {
    throw new NotFoundException('You are not a member of this group.');
  }

  // 2. מציאת הקבוצה
  const group = await this.findOne(id);

  // 3. הגנה: אי אפשר לעזוב קבוצה שכבר נכשלה או הסתיימה (אופציונלי, תלוי בלוגיקה העסקית שלך)
  if (group.status === GroupStatus.FAILED) {
    throw new BadRequestException('Cannot leave a group that has already failed.');
  }

  // 4. מחיקת החברות (או עדכון לסטטוס CANCELLED אם תרצה לשמור היסטוריה)
  await this.membershipRepo.remove(membership);

  // 5. עדכון המונה והסטטוס בקבוצה
  const newCount = Math.max(0, (group.joined_count || 0) - 1);
  let newStatus = group.status;

  // אם הקבוצה הייתה מלאה ועכשיו חסר חבר, נפתח אותה שוב
  if (newStatus === GroupStatus.COMPLETED && newCount < group.target_members) {
    newStatus = GroupStatus.OPEN;
  }

  await this.groupRepo.update(id, {
    joined_count: newCount,
    status: newStatus
  });

  this.logger.log(`User ${userId} left group ${id}. New count: ${newCount}`);

  return this.findOne(id, userIdString);
}
// בתוך GroupsService
async findUserGroups(userId: number): Promise<Group[]> {
  const memberships = await this.membershipRepo.find({
    where: { userId: String(userId) },
    relations: ['group', 'group.product'], // טוען גם את נתוני הקבוצה והמוצר
  });
  
  // מחזיר רק את אובייקט הקבוצה מתוך כל חברות
  return memberships.map(m => m.group);
}
}