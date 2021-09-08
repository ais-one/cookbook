import { AbstractService } from 'src/abstract/abstract.service';
import { Repository } from 'typeorm';
import { Permission } from './model/permission.entity';
export declare class PermissionService extends AbstractService {
    private readonly permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
}
