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
exports.TokenEntity = void 0;
const typeorm_1 = require("typeorm");
let TokenEntity = class TokenEntity {
};
exports.TokenEntity = TokenEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TokenEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'token', type: "varchar", unique: true }),
    __metadata("design:type", String)
], TokenEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Expire_Time', type: "timestamp" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], TokenEntity.prototype, "Expire_Time", void 0);
exports.TokenEntity = TokenEntity = __decorate([
    (0, typeorm_1.Entity)("Token")
], TokenEntity);
//# sourceMappingURL=Token.entity.js.map