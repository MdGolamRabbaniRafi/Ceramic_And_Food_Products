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
exports.ReviewRatingEntity = void 0;
const Product_entity_1 = require("../Product/Product.entity");
const User_entity_1 = require("../User/User.entity");
const typeorm_1 = require("typeorm");
let ReviewRatingEntity = class ReviewRatingEntity {
};
exports.ReviewRatingEntity = ReviewRatingEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReviewRatingEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: "timestamp" }),
    __metadata("design:type", Date)
], ReviewRatingEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'review', type: "varchar" }),
    __metadata("design:type", String)
], ReviewRatingEntity.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating', type: "float" }),
    __metadata("design:type", Number)
], ReviewRatingEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_entity_1.ProductEntity, product => product.ReviewRating),
    __metadata("design:type", Product_entity_1.ProductEntity)
], ReviewRatingEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.UserEntity, user => user.ReviewRating),
    __metadata("design:type", User_entity_1.UserEntity)
], ReviewRatingEntity.prototype, "user", void 0);
exports.ReviewRatingEntity = ReviewRatingEntity = __decorate([
    (0, typeorm_1.Entity)("ReviewRating")
], ReviewRatingEntity);
//# sourceMappingURL=ReviewRating.entity.js.map