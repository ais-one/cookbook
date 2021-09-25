import { ClassSerializerInterceptor, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { OrderService } from './order.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) { }

  @Get()
  @HasPermission('orders')
  async all(@Query('page') page: number = 1) {
    return this.orderService.paginate(page, ['order_item'])
    // return this.orderService.all(['order_item'])
  }

  @Post('export')
  @HasPermission('orders')
  async exportCsv(@Res() response: Response) {
    const parser = new Parser({ 
      fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity']
    })

    const orders = await this.orderService.all(['order_item'])
  
    const json = []
    orders.forEach((o) => {
      json.push({
        ID: o.id,
        Name: o.name,
        Email: o.email,
        'Product Title': '',
        Price: '',
        Quantity: ''
      })
      o.order_item.forEach((oi) => {
        json.push({
          ID: '',
          Name: '',
          Email: '',
          'Product Title': oi.product_title,
          Price: oi.price,
          Quantity: oi.quantity
        })
      })
    })
    const csv = parser.parse(json)
    response.header('Content-Type', 'text/csv')
    response.attachment('orders.csv')
    response.send(csv)
    response.end()
  }

  @Get('chart')
  @HasPermission('orders')
  async chart() {
    return this.orderService.chart()
  }
}
