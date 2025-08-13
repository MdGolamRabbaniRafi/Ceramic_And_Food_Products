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
exports.OrderProductMapperEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const Order_entity_1 = require("../../Order/Order.entity");
const Product_entity_1 = require("../../Product/Product.entity");
const typeorm_1 = require("typeorm");
let OrderProductMapperEntity = class OrderProductMapperEntity {
};
exports.OrderProductMapperEntity = OrderProductMapperEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderProductMapperEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_entity_1.OrderEntity, (order) => order.orderProductMappers, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Order_entity_1.OrderEntity)
], OrderProductMapperEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_entity_1.ProductEntity, (product) => product.orders, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Product_entity_1.ProductEntity)
], OrderProductMapperEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], OrderProductMapperEntity.prototype, "json_attribute", void 0);
exports.OrderProductMapperEntity = OrderProductMapperEntity = __decorate([
    (0, swagger_1.ApiTags)('Banner'),
    (0, typeorm_1.Entity)('OrderProductMapper')
], OrderProductMapperEntity);
//# sourceMappingURL=OrderProductMapper.entity.js.map