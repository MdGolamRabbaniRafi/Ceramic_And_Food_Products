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
exports.OTPEntity = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../User/User.entity");
let OTPEntity = class OTPEntity {
};
exports.OTPEntity = OTPEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OTPEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'otp', type: 'varchar' }),
    __metadata("design:type", String)
], OTPEntity.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Expire_Time', type: 'timestamp' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], OTPEntity.prototype, "Expire_Time", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Email', type: 'varchar' }),
    __metadata("design:type", String)
], OTPEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user', type: 'json', nullable: true }),
    __metadata("design:type", User_entity_1.UserEntity)
], OTPEntity.prototype, "User", void 0);
exports.OTPEntity = OTPEntity = __decorate([
    (0, typeorm_1.Entity)('OTP')
], OTPEntity);
//# sourceMappingURL=EmailOTP.entity.js.map