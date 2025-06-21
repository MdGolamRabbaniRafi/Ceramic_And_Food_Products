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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishListController = void 0;
const common_1 = require("@nestjs/common");
const WishList_service_1 = require("./WishList.service");
const WishList_entity_1 = require("./WishList.entity");
let WishListController = class WishListController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    wishListProduct(myobj) {
        const product = myobj.product.Id;
        const user = myobj.user.Id;
        return this.wishlistService.wishListProduct({ product, user });
    }
    showWishListProduct(userId) {
        return this.wishlistService.showWishListProduct(userId);
    }
    deleteWishListProduct(id) {
        return this.wishlistService.deleteWishListProduct(id);
    }
};
exports.WishListController = WishListController;
__decorate([
    (0, common_1.Post)('/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WishList_entity_1.WishListEntity]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "wishListProduct", null);
__decorate([
    (0, common_1.Get)('show_wishlist/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "showWishListProduct", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "deleteWishListProduct", null);
exports.WishListController = WishListController = __decorate([
    (0, common_1.Controller)('WishList'),
    __metadata("design:paramtypes", [WishList_service_1.WishListService])
], WishListController);
//# sourceMappingURL=WishList.controller.js.map