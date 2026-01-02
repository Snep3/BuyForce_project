import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupMembership } from 'src/group_memberships/group_memberships.entity';
import { Product } from 'src/products/product.entity';
import { CombinedGroupsController } from './combined-groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMembership, Product])],
  providers: [GroupsService],
  controllers: [GroupsController,CombinedGroupsController],
  exports: [TypeOrmModule, GroupsService] // 👈 חשוב מאוד! מאפשר למודולים אחרים (כמו Transactions) לראות את ה-Entity
})
export class GroupsModule {}