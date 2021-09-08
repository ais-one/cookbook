import { Response } from 'express';
import { OrderService } from './order.service';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    all(page?: number): Promise<import("../abstract/paginated-result").PaginatedResult>;
    exportCsv(response: Response): Promise<void>;
    chart(): Promise<any>;
}
