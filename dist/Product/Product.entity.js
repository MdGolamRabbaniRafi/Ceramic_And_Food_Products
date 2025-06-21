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
exports.ProductEntity = void 0;
const Cart_entity_1 = require("../Cart/Cart.entity");
const Category_entity_1 = require("../Category/Category.entity");
const Order_entity_1 = require("../Order/Order.entity");
const typeorm_1 = require("typeorm");
const Discount_entity_1 = require("./Discount/Discount.entity");
const ReviewRating_entity_1 = require("../Review And Rating/ReviewRating.entity");
const WishList_entity_1 = require("../WishList/WishList.entity");
const Collection_entity_1 = require("../Collection/Collection.entity");
const OrderProductMapper_entity_1 = require("../Mapper/Order Product Mapper/OrderProductMapper.entity");
let ProductEntity = class ProductEntity {
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: "varchar", length: 150 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'desc', type: "varchar", length: 150 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "desc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price', type: "decimal" }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: "integer" }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image', type: "varchar", length: 1500 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: "timestamp" }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'json_atribute', type: "json" }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "json_attribute", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Cart_entity_1.CartEntity, (cart) => cart.products),
    __metadata("design:type", Array)
], ProductEntity.prototype, "carts", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Order_entity_1.OrderEntity, (order) => order.products),
    __metadata("design:type", Array)
], ProductEntity.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_entity_1.CategoryEntity, category => category.product),
    __metadata("design:type", Category_entity_1.CategoryEntity)
], ProductEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Collection_entity_1.CollectionEntity, collection => collection.products),
    __metadata("design:type", Array)
], ProductEntity.prototype, "collections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReviewRating_entity_1.ReviewRatingEntity, ReviewRating => ReviewRating.product),
    __metadata("design:type", Array)
], ProductEntity.prototype, "ReviewRating", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WishList_entity_1.WishListEntity, wishlist => wishlist.product),
    __metadata("design:type", Array)
], ProductEntity.prototype, "wishlist", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Discount_entity_1.DiscountEntity, (discount) => discount.products, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Discount_entity_1.DiscountEntity)
], ProductEntity.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderProductMapper_entity_1.OrderProductMapperEntity, (mapper) => mapper.product, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], ProductEntity.prototype, "orderProductMappers", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, typeorm_1.Entity)("Product")
], ProductEntity);
//# sourceMappingURL=Product.entity.js.map