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
exports.OrderEntity = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../User/User.entity");
const Product_entity_1 = require("../Product/Product.entity");
const Cupon_entity_1 = require("../Cupon/Cupon.entity");
const OrderProductMapper_entity_1 = require("../Mapper/Order Product Mapper/OrderProductMapper.entity");
const Payment_entity_1 = require("../Payment/Payment.entity");
let OrderEntity = class OrderEntity {
};
exports.OrderEntity = OrderEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], OrderEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], OrderEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OrderEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "receiverPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', default: false }),
    __metadata("design:type", Boolean)
], OrderEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], OrderEntity.prototype, "originalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    __metadata("design:type", Number)
], OrderEntity.prototype, "discountedPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.UserEntity, (user) => user.order),
    __metadata("design:type", User_entity_1.UserEntity)
], OrderEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => "NOW() + INTERVAL '10 minutes'",
    }),
    __metadata("design:type", Date)
], OrderEntity.prototype, "expireTime", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Product_entity_1.ProductEntity),
    (0, typeorm_1.JoinTable)({
        name: 'Order_Product',
        joinColumn: { name: 'orderId', referencedColumnName: 'Id' },
        inverseJoinColumn: { name: 'productId', referencedColumnName: 'Id' },
    }),
    __metadata("design:type", Array)
], OrderEntity.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderProductMapper_entity_1.OrderProductMapperEntity, (mapper) => mapper.order, {
        nullable: true,
        cascade: true,
    }),
    __metadata("design:type", Array)
], OrderEntity.prototype, "orderProductMappers", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cupon_entity_1.CuponEntity, (cupon) => cupon.orders, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Cupon_entity_1.CuponEntity)
], OrderEntity.prototype, "cupon", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Payment_entity_1.PaymentEntity, (payment) => payment.order),
    __metadata("design:type", Payment_entity_1.PaymentEntity)
], OrderEntity.prototype, "payment", void 0);
exports.OrderEntity = OrderEntity = __decorate([
    (0, typeorm_1.Entity)('Order')
], OrderEntity);
//# sourceMappingURL=Order.entity.js.map