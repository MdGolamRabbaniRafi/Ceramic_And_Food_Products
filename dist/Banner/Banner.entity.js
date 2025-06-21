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
exports.BannerEntity = void 0;
const typeorm_1 = require("typeorm");
let BannerEntity = class BannerEntity {
};
exports.BannerEntity = BannerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BannerEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FileName', type: "varchar", length: 1500 }),
    __metadata("design:type", String)
], BannerEntity.prototype, "FileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'path', type: "varchar" }),
    __metadata("design:type", String)
], BannerEntity.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'EventLink', type: "varchar" }),
    __metadata("design:type", String)
], BannerEntity.prototype, "EventLink", void 0);
exports.BannerEntity = BannerEntity = __decorate([
    (0, typeorm_1.Entity)("Banner")
], BannerEntity);
//# sourceMappingURL=Banner.entity.js.map