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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const has_permission_decorator_1 = require("../permission/has-permission.decorator");
const role_service_1 = require("./role.service");
let RoleController = class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async all() {
        return this.roleService.all();
    }
    async create(name, permissionIds) {
        return this.roleService.create({
            name,
            permission: permissionIds.map(id => ({ id }))
        });
    }
    async get(id) {
        return this.roleService.findOne({ id }, ['permission']);
    }
    async update(id, name, permissionIds) {
        await this.roleService.update(id, { name });
        const role = await this.roleService.findOne({ id });
        return this.roleService.create(Object.assign(Object.assign({}, role), { permission: permissionIds.map(id => ({ id })) }));
    }
    async delete(id) {
        return this.roleService.delete(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, has_permission_decorator_1.HasPermission)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "all", null);
__decorate([
    (0, common_1.Post)(),
    (0, has_permission_decorator_1.HasPermission)('roles'),
    __param(0, (0, common_1.Body)('name')),
    __param(1, (0, common_1.Body)('permission')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, has_permission_decorator_1.HasPermission)('roles'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, has_permission_decorator_1.HasPermission)('roles'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('permission')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Array]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, has_permission_decorator_1.HasPermission)('roles'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "delete", null);
RoleController = __decorate([
    (0, common_1.Controller)('role'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map