import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './model/order.entity';
import { OrderItem } from './model/order-item.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Order, OrderItem])
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
