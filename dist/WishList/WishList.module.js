"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishListModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const WishList_entity_1 = require("./WishList.entity");
const WishList_controller_1 = require("./WishList.controller");
const WishList_service_1 = require("./WishList.service");
const Product_entity_1 = require("../Product/Product.entity");
const User_entity_1 = require("../User/User.entity");
let WishListModule = class WishListModule {
};
exports.WishListModule = WishListModule;
exports.WishListModule = WishListModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                WishList_entity_1.WishListEntity, Product_entity_1.ProductEntity, User_entity_1.UserEntity,
            ]),
        ],
        controllers: [WishList_controller_1.WishListController],
        providers: [WishList_service_1.WishListService],
    })
], WishListModule);
//# sourceMappingURL=WishList.module.js.map