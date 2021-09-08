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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const json2csv_1 = require("json2csv");
const auth_guard_1 = require("../auth/auth.guard");
const has_permission_decorator_1 = require("../permission/has-permission.decorator");
const order_service_1 = require("./order.service");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async all(page = 1) {
        return this.orderService.paginate(page, ['order_item']);
    }
    async exportCsv(response) {
        const parser = new json2csv_1.Parser({
            fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity']
        });
        const orders = await this.orderService.all(['order_item']);
        const json = [];
        orders.forEach((o) => {
            json.push({
                ID: o.id,
                Name: o.name,
                Email: o.email,
                'Product Title': '',
                Price: '',
                Quantity: ''
            });
            o.order_item.forEach((oi) => {
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    'Product Title': oi.product_title,
                    Price: oi.price,
                    Quantity: oi.quantity
                });
            });
        });
        const csv = parser.parse(json);
        response.header('Content-Type', 'text/csv');
        response.attachment('orders.csv');
        response.send(csv);
        response.end();
    }
    async chart() {
        return this.orderService.chart();
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, has_permission_decorator_1.HasPermission)('orders'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "all", null);
__decorate([
    (0, common_1.Post)('export'),
    (0, has_permission_decorator_1.HasPermission)('orders'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('chart'),
    (0, has_permission_decorator_1.HasPermission)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "chart", null);
OrderController = __decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map