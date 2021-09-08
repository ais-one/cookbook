import { Role } from './models/role.entity';
import { RoleService } from './role.service';
export declare class RoleController {
    private roleService;
    constructor(roleService: RoleService);
    all(): Promise<any[]>;
    create(name: string, permissionIds: number[]): Promise<Role>;
    get(id: number): Promise<any>;
    update(id: number, name: string, permissionIds: number[]): Promise<any>;
    delete(id: number): Promise<any>;
}
