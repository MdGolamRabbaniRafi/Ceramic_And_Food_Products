"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Payment_entity_1 = require("./Payment.entity");
const Payment_service_1 = require("./Payment.service");
const Payment_controller_1 = require("./Payment.controller");
const User_entity_1 = require("../User/User.entity");
const Order_entity_1 = require("../Order/Order.entity");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Payment_entity_1.PaymentEntity, User_entity_1.UserEntity, Order_entity_1.OrderEntity])],
        controllers: [Payment_controller_1.PaymentController],
        providers: [Payment_service_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=Payment.module.js.map