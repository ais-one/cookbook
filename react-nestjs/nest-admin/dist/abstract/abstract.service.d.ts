import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result';
export declare abstract class AbstractService {
    protected repository: Repository<any>;
    protected constructor(repository: Repository<any>);
    all(relations?: any[]): Promise<any[]>;
    paginate(page?: number, relations?: any[]): Promise<PaginatedResult>;
    create(data: any): Promise<any>;
    findOne(condition: any, relations?: any[]): Promise<any>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}
