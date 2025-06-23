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
exports.CollectionEntity = void 0;
const Product_entity_1 = require("../Product/Product.entity");
const typeorm_1 = require("typeorm");
let CollectionEntity = class CollectionEntity {
};
exports.CollectionEntity = CollectionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CollectionEntity.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: "varchar", length: 150 }),
    __metadata("design:type", String)
], CollectionEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Product_entity_1.ProductEntity, product => product.collections),
    (0, typeorm_1.JoinTable)({
        name: "ProductCollectionMapper",
        joinColumn: { name: "collectionId", referencedColumnName: "Id" },
        inverseJoinColumn: { name: "productId", referencedColumnName: "Id" },
    }),
    __metadata("design:type", Array)
], CollectionEntity.prototype, "products", void 0);
exports.CollectionEntity = CollectionEntity = __decorate([
    (0, typeorm_1.Entity)("Collection")
], CollectionEntity);
//# sourceMappingURL=Collection.entity.js.map