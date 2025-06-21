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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Cart_entity_1 = require("./Cart.entity");
const Product_entity_1 = require("../Product/Product.entity");
let CartService = class CartService {
    constructor(cartRepo, productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }
    async findByUserId(userId) {
        const cartEntities = await this.cartRepo.find({
            where: { user: { Id: userId } },
            relations: ['user'],
        });
        cartEntities.forEach(cart => {
            if (cart.products) {
                cart.products.forEach(p => {
                    if (typeof p.product.image === 'string') {
                        p.product.image = p.product.image
                            .split(',')
                            .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
                            .join(',');
                    }
                    if (p.product.discount) {
                        p.product['discountedPrice'] = this.calculateDiscountedPrice(p.product.price, p.product.discount.discountPercentage);
                    }
                });
            }
            if (cart.user && typeof cart.user.Image === 'string') {
                cart.user.Image = cart.user.Image.replace('/home/farseit1/public_html', 'https://farseit.com');
            }
        });
        return cartEntities;
    }
    calculateDiscountedPrice(price, discountPercentage) {
        const discountAmount = price * (discountPercentage / 100);
        return parseFloat((price - discountAmount).toFixed(2));
    }
    async addToCart(cartData) {
        const { userId, productId } = cartData;
        console.log("cartData", cartData);
        const productEntity = await this.productRepo.findOne({
            where: { Id: productId },
        });
        if (!productEntity) {
            return { success: false, message: "Product does not exist", cart: null };
        }
        let cart = await this.cartRepo.findOne({
            where: { user: { Id: userId } },
        });
        if (cart) {
            console.log("cart", cart);
            let products = cart.products || [];
            const existingProduct = products.find(p => p.product.Id === productId);
            if (existingProduct) {
                existingProduct.product.image = existingProduct.product.image
                    .split(',')
                    .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
                    .join(',');
                existingProduct.quantity += 1;
            }
            else {
                productEntity.image = productEntity.image
                    .split(',')
                    .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
                    .join(',');
                products.push({ product: productEntity, quantity: 1 });
            }
            cart.products = products;
            await this.cartRepo.save(cart);
        }
        else {
            console.log("Creating new cart");
            cart = new Cart_entity_1.CartEntity();
            cart.user = { Id: userId };
            cart.products = [{ product: productEntity, quantity: 1 }];
            cart.session_id = Math.floor(Math.random() * 1000000);
            cart.date = new Date();
            cart.products.forEach(p => {
                if (typeof p.product.image === 'string') {
                    p.product.image = p.product.image
                        .split(',')
                        .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
                        .join(',');
                }
                if (p.product.discount) {
                    const discountedPrice = this.calculateDiscountedPrice(p.product.price, p.product.discount.discountPercentage);
                    p['discountedPrice'] = discountedPrice;
                }
            });
            await this.cartRepo.save(cart);
        }
        return { success: true, message: "Product added to cart successfully", cart };
    }
    async ProductCount(userId) {
        const cart = await this.cartRepo.findOne({
            where: { user: { Id: userId } },
        });
        if (!cart) {
            return 0;
        }
        const uniqueProducts = new Set(cart.products.map(product => product.product.Id));
        return uniqueProducts.size;
    }
    async reduceToCart(cartData) {
        const { userId, productId } = cartData;
        console.log("cartData", cartData);
        const productEntity = await this.productRepo.findOne({
            where: { Id: productId },
        });
        if (!productEntity) {
            return { success: false, message: "Product does not exist", cart: null };
        }
        let cart = await this.cartRepo.findOne({
            where: { user: { Id: userId } },
        });
        if (cart) {
            console.log("cart", JSON.stringify(cart));
            let products = cart.products || [];
            const existingProduct = products.find(p => p.product.Id === Number(productId));
            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.product.image = existingProduct.product.image
                        .split(',')
                        .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
                        .join(',');
                    existingProduct.quantity -= 1;
                }
                else {
                    products = products.filter(p => p.product.Id !== Number(productId));
                }
            }
            else {
                return { success: false, message: "Product not found in cart", cart: null };
            }
            if (products.length === 0) {
                await this.cartRepo.remove(cart);
                return { success: true, message: "Cart is now empty and has been removed", cart: null };
            }
            cart.products = products;
            await this.cartRepo.save(cart);
        }
        else {
            return { success: false, message: "Cart not found", cart: null };
        }
        return { success: true, message: "Product quantity reduced by one", cart: cart };
    }
    async removeProductFromCart(userId, productId) {
        const numericProductId = Number(productId);
        let cart = await this.cartRepo.findOne({
            where: { user: { Id: userId } },
        });
        if (!cart) {
            return { success: false, message: "Cart not found" };
        }
        if (!cart.products) {
            return { success: false, message: "No products in cart" };
        }
        console.log("Cart Products IDs:", cart.products.map(p => p.product.Id));
        console.log("Product to remove:", numericProductId);
        const productExists = cart.products.some(p => p.product.Id === numericProductId);
        if (!productExists) {
            return { success: false, message: "Product not found in cart" };
        }
        cart.products = cart.products.filter(p => p.product.Id !== numericProductId);
        await this.cartRepo.save(cart);
        console.log("Product removed from cart in DB.");
        return { success: true, message: "Product removed from cart successfully" };
    }
    async deleteByUserId(userId) {
        const result = await this.cartRepo.delete({ user: { Id: userId } });
        return result.affected > 0;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Cart_entity_1.CartEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(Product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=Cart.service.js.map