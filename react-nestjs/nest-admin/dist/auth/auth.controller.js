"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const register_dto_1 = require("./models/register.dto");
const auth_interceptor_1 = require("./auth.interceptor");
const auth_guard_1 = require("./auth.guard");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(userService, jwtService, authService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authService = authService;
    }
    async register(body) {
        if (body.password !== body.password_confirm)
            throw new common_1.BadRequestException('Password Does Not Match');
        body.password = await bcrypt.hash(body.password, 12);
        return this.userService.create(Object.assign(Object.assign({}, body), { role: { id: 1 } }));
    }
    async login(email, password, response) {
        const user = await this.userService.findOne({ email });
        if (!user)
            throw new common_1.NotFoundException('User Not Found');
        if (!await bcrypt.compare(password, user.password))
            throw new common_1.BadRequestException('Invalid Credentials');
        const jwt = await this.jwtService.signAsync({ id: user.id });
        response.cookie('jwt', jwt, { httpOnly: true, sameSite: 'lax' });
        return user;
    }
    async user(request) {
        const id = await this.authService.userId(request);
        return this.userService.findOne({ id });
    }
    async logout(response) {
        response.clearCookie('jwt');
        return {
            message: 'logged out'
        };
    }
};
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "user", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor, auth_interceptor_1.AuthInterceptor),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map