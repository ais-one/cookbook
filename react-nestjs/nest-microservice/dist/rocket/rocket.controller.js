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
exports.RocketController = void 0;
const common_1 = require("@nestjs/common");
const rocket_service_1 = require("./rocket.service");
let RocketController = class RocketController {
    constructor(rocketService) {
        this.rocketService = rocketService;
    }
    getNextLaunchRemainingTime() {
        return this.rocketService.getNextLaunchRemainingTime();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RocketController.prototype, "getNextLaunchRemainingTime", null);
RocketController = __decorate([
    (0, common_1.Controller)('rocket'),
    __metadata("design:paramtypes", [rocket_service_1.RocketService])
], RocketController);
exports.RocketController = RocketController;
//# sourceMappingURL=rocket.controller.js.map