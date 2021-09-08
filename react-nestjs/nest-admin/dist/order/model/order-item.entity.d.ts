import { Order } from "./order.entity";
export declare class OrderItem {
    id: number;
    product_title: string;
    price: number;
    quantity: number;
    order: Order;
}
