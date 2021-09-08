import { AbstractService } from 'src/abstract/abstract.service';
import { PaginatedResult } from 'src/abstract/paginated-result';
import { Repository } from 'typeorm';
import { Order } from './model/order.entity';
export declare class OrderService extends AbstractService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<Order>);
    paginate(page?: number, relations?: any[]): Promise<PaginatedResult>;
    chart(): Promise<any>;
}
