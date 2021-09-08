import { UserService } from './user.service';
import { User } from './models/user.entity';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { PaginatedResult } from 'src/abstract/paginated-result';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
export declare class UserController {
    private userService;
    private authService;
    constructor(userService: UserService, authService: AuthService);
    all(page?: number): Promise<PaginatedResult>;
    create(body: UserCreateDto): Promise<User>;
    updateInfo(body: UserUpdateDto, request: Request): Promise<any>;
    updatePassword(password: string, password_confirm: string, request: Request): Promise<any>;
    get(id: number): Promise<any>;
    update(id: number, body: UserUpdateDto): Promise<any>;
    delete(id: number): Promise<any>;
}
