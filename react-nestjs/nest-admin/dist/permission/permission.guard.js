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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_service_1 = require("../auth/auth.service");
const role_service_1 = require("../role/role.service");
const user_service_1 = require("../user/user.service");
let PermissionGuard = class PermissionGuard {
    constructor(reflector, authService, userService, roleService) {
        this.reflector = reflector;
        this.authService = authService;
        this.userService = userService;
        this.roleService = roleService;
    }
    async canActivate(context) {
        const access = this.reflector.get('access', context.getHandler());
        if (!access)
            return true;
        const request = context.switchToHttp().getRequest();
        const id = await this.authService.userId(request);
        const user = await this.userService.findOne({ id }, ['role']);
        const role = await this.roleService.findOne({ id: user.role.id }, ['permission']);
        console.log('access', access);
        if (request.method === 'GET') {
            return role.permission.some(p => p.name === 'view_' + access || p.name === 'edit_' + access);
        }
        else {
            return role.permission.some(p => p.name === 'edit_' + access);
        }
    }
};
PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        auth_service_1.AuthService,
        user_service_1.UserService,
        role_service_1.RoleService])
], PermissionGuard);
exports.PermissionGuard = PermissionGuard;
//# sourceMappingURL=permission.guard.js.map