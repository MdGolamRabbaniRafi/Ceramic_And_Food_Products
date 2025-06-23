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
exports.UserEntity = void 0;
const Cart_entity_1 = require("../Cart/Cart.entity");
const ReviewRating_entity_1 = require("../Review And Rating/ReviewRating.entity");
const WishList_entity_1 = require("../WishList/WishList.entity");
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: "varchar", length: 150 }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: "varchar", length: 150, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: "varchar", length: 150, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 150, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', type: "varchar", length: 150 }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_date', type: "timestamp" }),
    __metadata("design:type", Date)
], UserEntity.prototype, "registration_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role', type: "varchar" }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'User Image', type: "varchar" }),
    __metadata("design:type", String)
], UserEntity.prototype, "Image", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cart_entity_1.CartEntity, cart => cart.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cart_entity_1.CartEntity, order => order.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReviewRating_entity_1.ReviewRatingEntity, ReviewRating => ReviewRating.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "ReviewRating", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WishList_entity_1.WishListEntity, wishlist => wishlist.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "wishlist", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)("User")
], UserEntity);
//# sourceMappingURL=User.entity.js.map