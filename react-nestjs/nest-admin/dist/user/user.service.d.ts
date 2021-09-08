import { AbstractService } from 'src/abstract/abstract.service';
import { PaginatedResult } from 'src/abstract/paginated-result';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
export declare class UserService extends AbstractService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    paginate(page?: number, relations?: any[]): Promise<PaginatedResult>;
}
