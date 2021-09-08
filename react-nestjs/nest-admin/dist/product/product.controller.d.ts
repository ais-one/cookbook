import { PaginatedResult } from 'src/abstract/paginated-result';
import { ProductCreateDto } from './model/product-create.dto';
import { ProductUpdateDto } from './model/product-update.dto';
import { Product } from './model/product.entity';
import { ProductService } from './product.service';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    all(page?: number): Promise<PaginatedResult>;
    create(body: ProductCreateDto): Promise<Product>;
    get(id: number): Promise<any>;
    update(id: number, body: ProductUpdateDto): Promise<any>;
    delete(id: number): Promise<any>;
}
