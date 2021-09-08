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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const abstract_service_1 = require("../abstract/abstract.service");
const paginated_result_1 = require("../abstract/paginated-result");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./model/order.entity");
let OrderService = class OrderService extends abstract_service_1.AbstractService {
    constructor(orderRepository) {
        super(orderRepository);
        this.orderRepository = orderRepository;
    }
    async paginate(page = 1, relations = []) {
        const { data, meta } = await super.paginate(page, relations);
        return {
            data: data.map((order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                price: order.price,
                total: order.total,
                created_at: order.created_at,
                order_item: order.order_item
            })),
            meta
        };
    }
    async chart() {
        return this.orderRepository.query(`
      SELECT SUBSTR(created_at, 0, 11) as date, SUM(oi.price * oi.quantity) as "sum" FROM "order" o JOIN order_item oi ON o.id = oi.order_id GROUP BY date;
    `);
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map