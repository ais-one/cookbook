import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_title: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, order => order.order_item)
  @JoinColumn({ name: 'order_id'})
  order: Order;
}
