import { AbstractService } from 'src/abstract/abstract.service';
import { Repository } from 'typeorm';
import { Product } from './model/product.entity';
export declare class ProductService extends AbstractService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
}
