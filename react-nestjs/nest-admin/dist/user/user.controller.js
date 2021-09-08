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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const bcrypt = require("bcryptjs");
const user_create_dto_1 = require("./models/user-create.dto");
const user_update_dto_1 = require("./models/user-update.dto");
const auth_guard_1 = require("../auth/auth.guard");
const paginated_result_1 = require("../abstract/paginated-result");
const auth_service_1 = require("../auth/auth.service");
const has_permission_decorator_1 = require("../permission/has-permission.decorator");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    all(page = 1) {
        return this.userService.paginate(page, ['role']);
    }
    async create(body) {
        const password = await bcrypt.hash('test', 12);
        const { role_id } = body, data = __rest(body, ["role_id"]);
        return this.userService.create(Object.assign(Object.assign({}, data), { password, role: { id: body.role_id } }));
    }
    async updateInfo(body, request) {
        const id = await this.authService.userId(request);
        await this.userService.update(id, body);
        return this.userService.findOne({ id });
    }
    async updatePassword(password, password_confirm, request) {
        if (password !== password_confirm)
            throw new common_1.BadRequestException('Password Does Not Match');
        const id = await this.authService.userId(request);
        const hashed = await bcrypt.hash(password, 12);
        await this.userService.update(id, { password: hashed });
        return this.userService.findOne({ id });
    }
    async get(id) {
        return this.userService.findOne({ id }, ['role']);
    }
    async update(id, body) {
        const { role_id } = body, data = __rest(body, ["role_id"]);
        await this.userService.update(id, Object.assign({}, data));
        return this.userService.findOne({ id });
    }
    async delete(id) {
        return this.userService.delete(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, has_permission_decorator_1.HasPermission)('users'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "all", null);
__decorate([
    (0, common_1.Post)(),
    (0, has_permission_decorator_1.HasPermission)('users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_create_dto_1.UserCreateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('info'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_update_dto_1.UserUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateInfo", null);
__decorate([
    (0, common_1.Put)('password'),
    __param(0, (0, common_1.Body)('password')),
    __param(1, (0, common_1.Body)('password_confirm')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, has_permission_decorator_1.HasPermission)('users'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, has_permission_decorator_1.HasPermission)('users'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_update_dto_1.UserUpdateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, has_permission_decorator_1.HasPermission)('users'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
UserController = __decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map