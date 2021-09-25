import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // TBD Change to one to one map with user
  @Column()
  @Exclude()
  first_name: string;

  @Column()
  @Exclude()
  last_name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_item: OrderItem[]

  @Expose()
  get name(): string {
    return `${this.first_name} ${this.last_name}`
  }

  @Expose()
  get total(): number {
    return this.order_item.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }
}
