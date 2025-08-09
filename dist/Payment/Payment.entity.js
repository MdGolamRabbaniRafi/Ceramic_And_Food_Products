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
exports.PaymentEntity = void 0;
const Order_entity_1 = require("../Order/Order.entity");
const User_entity_1 = require("../User/User.entity");
const typeorm_1 = require("typeorm");
let PaymentEntity = class PaymentEntity {
};
exports.PaymentEntity = PaymentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Pay_amount', type: 'int' }),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "Pay_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'timestamp', default: new Date() }),
    __metadata("design:type", Date)
], PaymentEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.UserEntity, (user) => user.payment),
    __metadata("design:type", User_entity_1.UserEntity)
], PaymentEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Order_entity_1.OrderEntity, (order) => order.payment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Order_entity_1.OrderEntity)
], PaymentEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "orderId", void 0);
exports.PaymentEntity = PaymentEntity = __decorate([
    (0, typeorm_1.Entity)('Payment')
], PaymentEntity);
//# sourceMappingURL=Payment.entity.js.map