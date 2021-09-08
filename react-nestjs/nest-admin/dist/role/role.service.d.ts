import { AbstractService } from 'src/abstract/abstract.service';
import { Repository } from 'typeorm';
import { Role } from './models/role.entity';
export declare class RoleService extends AbstractService {
    private readonly roleRepository;
    constructor(roleRepository: Repository<Role>);
}
