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
exports.Order = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const order_item_entity_1 = require("./order-item.entity");
let Order = class Order {
    get name() {
        return `${this.first_name} ${this.last_name}`;
    }
    get total() {
        return this.order_item.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Order.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Order.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], Order.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, orderItem => orderItem.order),
    __metadata("design:type", Array)
], Order.prototype, "order_item", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Order.prototype, "name", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Order.prototype, "total", null);
Order = __decorate([
    (0, typeorm_1.Entity)()
], Order);
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map