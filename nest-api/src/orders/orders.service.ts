// src/orders/orders.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { Product } from '../products/product.entity';
import { GroupMember } from '../groups/group-member.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepo: Repository<GroupMember>,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const group = await this.groupRepo.findOne({
      where: { id: dto.groupId },
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // נטען את כל המוצרים לפי ה־IDs שהגיעו
    const productIds = dto.items.map((i) => i.productId);

    const products = await this.productRepo.find({
      where: productIds.map((id) => ({ id })),
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const productMap = new Map<string, Product>();
    products.forEach((p) => productMap.set(p.id, p));

    let totalPriceDecimal = 0;

    const order = this.orderRepo.create({
      user,
      group,
      status: 'pending',
      totalPrice: '0',
    });

    const savedOrder = await this.orderRepo.save(order);

    const items: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = productMap.get(itemDto.productId);
      if (!product) {
        continue;
      }

      // נניח ש-price מוגדר כמספר או מחרוזת שניתן להמיר למספר
      const unitPriceNumber = Number((product as any).price ?? 0);
      if (Number.isNaN(unitPriceNumber)) {
        throw new BadRequestException('Invalid product price');
      }

      const lineTotal = unitPriceNumber * itemDto.quantity;
      totalPriceDecimal += lineTotal;

      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        product,
        quantity: itemDto.quantity,
        unitPrice: unitPriceNumber.toString(),
        totalPrice: lineTotal.toString(),
      });

      items.push(orderItem);
    }

    if (items.length === 0) {
      throw new BadRequestException('No valid items in order');
    }

    await this.orderItemRepo.save(items);

    // עדכון סכום ההזמנה
    savedOrder.totalPrice = totalPriceDecimal.toString();
    await this.orderRepo.save(savedOrder);

    // רישום המשתמש כחבר בקבוצה (אם עדיין לא רשום)
    const existingMembership = await this.groupMemberRepo.findOne({
      where: {
        user: { id: user.id },
        group: { id: group.id },
      },
    });

    if (!existingMembership) {
      const gm = this.groupMemberRepo.create({
        user,
        group,
        quantity: 1,
      });
      await this.groupMemberRepo.save(gm);
    }

    const fullOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'group'],
    });

    if (!fullOrder) {
      throw new NotFoundException('Order not found after creation');
    }

    return fullOrder;
  }

  async getMyOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'group'],
      order: { createdAt: 'DESC' },
    });
  }
}


