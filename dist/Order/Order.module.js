"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Order_entity_1 = require("./Order.entity");
const Order_controller_1 = require("./Order.controller");
const Order_service_1 = require("./Order.service");
const Product_module_1 = require("../Product/Product.module");
const OrderProductMapper_entity_1 = require("../Mapper/Order Product Mapper/OrderProductMapper.entity");
const Order_cleanup_1 = require("./Order.cleanup");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Order_entity_1.OrderEntity, OrderProductMapper_entity_1.OrderProductMapperEntity]),
            Product_module_1.ProductModule,
        ],
        controllers: [Order_controller_1.OrderController],
        providers: [Order_service_1.OrderService, Order_cleanup_1.OrderCleanupService],
        exports: [Order_service_1.OrderService, typeorm_1.TypeOrmModule],
    })
], OrderModule);
//# sourceMappingURL=Order.module.js.map