// src/orders/orders.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { Group } from '../groups/group.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // פונקציה פנימית אחת ליצירת הזמנה – כל ה־create* יקראו אליה
  private async createOrderInternal(userId: string, dto: any): Promise<Order> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // תומך גם במבנה: { items: [...] } וגם במבנה של מוצר יחיד (productId + quantity)
    const itemsInput =
      Array.isArray(dto.items) && dto.items.length > 0
        ? dto.items
        : dto.productId
        ? [{ productId: dto.productId, quantity: dto.quantity ?? 1 }]
        : [];

    if (!itemsInput.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const productIds = itemsInput.map((i) => i.productId);
    const products = await this.productRepo.find({
      where: { id: In(productIds) },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // קבוצה – חובה אצלכם כדי שהזמנה תהיה תקפה
    const group = dto.groupId
      ? await this.groupRepo.findOne({ where: { id: dto.groupId } })
      : null;

    if (!group) {
      throw new BadRequestException(
        'Group is required to create an order (product must belong to a group)',
      );
    }

    let orderTotal = 0;

    // יוצרים ישות Order בסיסית
    const order = this.orderRepo.create({
      totalPrice: '0', // שדה string לפי Order.totalPrice
      status: dto.status ?? 'pending',
      user,
      userId: user.id,
      group,
      groupId: group.id,
    });

    const savedOrder = await this.orderRepo.save(order);

    const orderItems: OrderItem[] = [];

    for (const item of itemsInput) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      const quantity = item.quantity ?? 1;
      const unitPriceNum = Number(product.price);
      const lineTotal = unitPriceNum * quantity;

      orderTotal += lineTotal;

      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        orderId: savedOrder.id,
        product,
        productId: product.id,
        quantity,
        unitPrice: unitPriceNum.toString(),
        totalPrice: lineTotal.toString(),
      });

      orderItems.push(orderItem);
    }

    await this.orderItemRepo.save(orderItems);

    savedOrder.totalPrice = orderTotal.toString();
    await this.orderRepo.save(savedOrder);

    const fullOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'group', 'user'],
    });

    if (!fullOrder) {
      throw new NotFoundException('Order not found after creation');
    }

    return fullOrder;
  }

  // שמות אלטרנטיביים – כדי שמה שלא קורא לך בקוד, יעבוד:
  async createOrder(userId: string, dto: any): Promise<Order> {
    return this.createOrderInternal(userId, dto);
  }

  async create(userId: string, dto: any): Promise<Order> {
    return this.createOrderInternal(userId, dto);
  }

  async createOrderForUser(userId: string, dto: any): Promise<Order> {
    return this.createOrderInternal(userId, dto);
  }

  // לוגיקת "ההזמנות שלי" – כמה שמות עטיפה, ליתר ביטחון:
  private async getUserOrdersInternal(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items', 'items.product', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersForUser(userId: string): Promise<Order[]> {
    return this.getUserOrdersInternal(userId);
  }

  async getMyOrders(userId: string): Promise<Order[]> {
    return this.getUserOrdersInternal(userId);
  }

  async findUserOrders(userId: string): Promise<Order[]> {
    return this.getUserOrdersInternal(userId);
  }

  // ========= ביטול הזמנה =========

  private async cancelOrderInternal(
    userId: string,
    orderId: string,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product', 'group'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // לא נותנים לבטל שוב, או לבטל הזמנה שכבר הושלמה
    if (order.status === 'canceled') {
      throw new BadRequestException('Order already canceled');
    }

    if (order.status === 'completed') {
      throw new BadRequestException('Completed orders cannot be canceled');
    }

    order.status = 'canceled';
    await this.orderRepo.save(order);

    return order;
  }

  async cancelOrder(userId: string, orderId: string): Promise<Order> {
    return this.cancelOrderInternal(userId, orderId);
  }

  // אם תרצה בהמשך – אפשר להוסיף גם aliasים:
  // cancel(userId: string, orderId: string) { ... }
}
