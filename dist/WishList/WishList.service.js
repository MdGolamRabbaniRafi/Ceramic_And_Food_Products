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
exports.WishListService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const WishList_entity_1 = require("./WishList.entity");
const Product_entity_1 = require("../Product/Product.entity");
const User_entity_1 = require("../User/User.entity");
let WishListService = class WishListService {
    constructor(productRepo, wishlistRepo, userRepo) {
        this.productRepo = productRepo;
        this.wishlistRepo = wishlistRepo;
        this.userRepo = userRepo;
    }
    async wishListProduct(myobj) {
        console.log(myobj);
        const currentDateTime = new Date();
        const user = await this.userRepo.findOne({ where: { Id: myobj.user } });
        const product = await this.productRepo.findOne({ where: { Id: myobj.product } });
        if (!user || !product) {
            return { message: 'User or Product not found.' };
        }
        const wishListEntity = new WishList_entity_1.WishListEntity();
        wishListEntity.user = user;
        wishListEntity.product = product;
        wishListEntity.date = currentDateTime;
        try {
            const existingWishlistItem = await this.wishlistRepo.findOne({
                where: {
                    user: { Id: myobj.user },
                    product: { Id: myobj.product }
                },
            });
            if (existingWishlistItem) {
                return { message: 'This product is already in your wishlist.' };
            }
            const savedEntity = await this.wishlistRepo.save(wishListEntity);
            if (savedEntity) {
                return savedEntity;
            }
            else {
                return { message: 'Failed to save the wishlist product.' };
            }
        }
        catch (error) {
            console.error('Error saving wishlist product:', error);
            return false;
        }
    }
    async showWishListProduct(username) {
        return await this.wishlistRepo.find({ where: { user: { Id: username } }, relations: ['product'] });
    }
    async deleteWishListProduct(id) {
        try {
            const wishlistItem = await this.wishlistRepo.findOne({ where: { Id: id } });
            if (!wishlistItem) {
                return { message: 'Wishlist item not found.' };
            }
            await this.wishlistRepo.delete(id);
            return true;
        }
        catch (error) {
            console.error('Error deleting wishlist product:', error);
            return false;
        }
    }
};
exports.WishListService = WishListService;
exports.WishListService = WishListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Product_entity_1.ProductEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(WishList_entity_1.WishListEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(User_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WishListService);
//# sourceMappingURL=WishList.service.js.map