import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PaginatedResult } from 'src/abstract/paginated-result';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductCreateDto } from './model/product-create.dto';
import { ProductUpdateDto } from './model/product-update.dto';
import { Product } from './model/product.entity';
import { ProductService } from './product.service';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get()
  all(@Query('page') page: number = 1): Promise<PaginatedResult> {
    return this.productService.paginate(page)
  }

  @Post()
  async create(@Body() body: ProductCreateDto): Promise<Product> {
    return this.productService.create(body)
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.productService.findOne({id})
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: ProductUpdateDto) {
    await this.productService.update(id, body)
    return this.productService.findOne({id})
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productService.delete(id)
  }
}
