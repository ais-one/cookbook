import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { Product } from './model/product.entity';
import { ProductUploadController } from './product-upload.controller';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CommonModule
  ],
  controllers: [
    ProductController,
    ProductUploadController
  ],
  providers: [ProductService]
})
export class ProductModule {}
