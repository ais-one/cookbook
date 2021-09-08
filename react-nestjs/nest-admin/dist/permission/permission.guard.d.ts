import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
export declare class PermissionGuard implements CanActivate {
    private reflector;
    private authService;
    private userService;
    private roleService;
    constructor(reflector: Reflector, authService: AuthService, userService: UserService, roleService: RoleService);
    canActivate(context: ExecutionContext): Promise<any>;
}
