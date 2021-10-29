import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/abstract/abstract.service';
import { PaginatedResult } from 'src/abstract/paginated-result';
import { Repository } from 'typeorm';
import { Order } from './model/order.entity';

@Injectable()
export class OrderService extends AbstractService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>
  ) {
    super(orderRepository)
  }

  async paginate(page: number = 1, relations: any[] = []): Promise<PaginatedResult> {
    const { data, meta } = await super.paginate(page, relations)

    return {
      data: data.map((order) => ({ // Using @Exclude @Expose
        id: order.id,
        name: order.name,
        email: order.email,
        price: order.price,
        total: order.total,
        created_at: order.created_at,
        order_item: order.order_item
      })),
      meta
    }
  }

  async chart() {
    return this.orderRepository.query(`
      SELECT SUBSTR(created_at, 0, 11) as date, SUM(oi.price * oi.quantity) as "sum" FROM "order" o JOIN order_item oi ON o.id = oi.order_id GROUP BY date;
    `)
  }
}
