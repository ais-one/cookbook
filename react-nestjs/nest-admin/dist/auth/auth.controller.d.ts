import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { RegisterDto } from './models/register.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private userService;
    private jwtService;
    private authService;
    constructor(userService: UserService, jwtService: JwtService, authService: AuthService);
    register(body: RegisterDto): Promise<any>;
    login(email: string, password: string, response: Response): Promise<any>;
    user(request: Request): Promise<any>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
