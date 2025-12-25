import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupMembership } from '../group_memberships/group_memberships.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMembership])],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [TypeOrmModule, GroupsService] // 👈 חשוב מאוד! מאפשר למודולים אחרים (כמו Transactions) לראות את ה-Entity
})
export class GroupsModule {}