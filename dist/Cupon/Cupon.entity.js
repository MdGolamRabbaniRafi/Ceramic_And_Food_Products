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
exports.CuponEntity = void 0;
const Order_entity_1 = require("../Order/Order.entity");
const typeorm_1 = require("typeorm");
let CuponEntity = class CuponEntity {
};
exports.CuponEntity = CuponEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CuponEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar' }),
    __metadata("design:type", String)
], CuponEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'decimal' }),
    __metadata("design:type", Number)
], CuponEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CuponEntity.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CuponEntity.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_entity_1.OrderEntity, (order) => order.cupon),
    __metadata("design:type", Array)
], CuponEntity.prototype, "orders", void 0);
exports.CuponEntity = CuponEntity = __decorate([
    (0, typeorm_1.Entity)('cupon')
], CuponEntity);
//# sourceMappingURL=Cupon.entity.js.map