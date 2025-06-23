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
var DiscountService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Discount_entity_1 = require("./Discount.entity");
const schedule_1 = require("@nestjs/schedule");
const Product_service_1 = require("../Product.service");
const Collection_entity_1 = require("../../Collection/Collection.entity");
let DiscountService = DiscountService_1 = class DiscountService {
    constructor(discountRepo, productService, collectionRepo) {
        this.discountRepo = discountRepo;
        this.productService = productService;
        this.collectionRepo = collectionRepo;
        this.logger = new common_1.Logger(DiscountService_1.name);
    }
    async getAllDiscounts() {
        return await this.discountRepo.find();
    }
    async getDiscountById(id) {
        const discount = await this.discountRepo.findOne({ where: { id: id } });
        if (!discount) {
            throw new common_1.NotFoundException(`Discount with ID ${id} not found`);
        }
        return discount;
    }
    async createDiscount(discountData, productId) {
        try {
            const product = await this.productService.SearchByIDWithoutDiscount(productId);
            console.log("product:", product);
            if (!product) {
                throw new common_1.InternalServerErrorException('Product not found');
            }
            if (product.discount) {
                let discount = product.discount;
                product.discount = null;
                console.log("before updating product");
                await this.productService.editProduct(product.Id, product);
            }
            const discount = new Discount_entity_1.DiscountEntity();
            discount.discountPercentage = discountData.discountPercentage;
            discount.startDate = discountData.startDate;
            discount.endDate = discountData.endDate;
            discount.products = [product];
            const newDiscount = await this.discountRepo.save(discount);
            product.discount = newDiscount;
            await this.productService.editProduct(product.Id, product);
            const responseDiscount = { ...newDiscount };
            delete responseDiscount.products;
            return responseDiscount;
        }
        catch (error) {
            console.error('Error creating discount:', error);
            throw new common_1.InternalServerErrorException('Error creating discount');
        }
    }
    async editDiscount(id, discountData) {
        const discount = await this.discountRepo.findOne({ where: { id: id } });
        if (!discount) {
            throw new common_1.NotFoundException(`Discount with ID ${id} not found`);
        }
        try {
            await this.discountRepo.update(id, discountData);
            return await this.discountRepo.findOne({ where: { id: id } });
        }
        catch (error) {
            console.error("Error updating discount:", error.message);
            throw new common_1.InternalServerErrorException('Error updating discount');
        }
    }
    async deleteDiscount(id) {
        const discount = await this.discountRepo.findOne({ where: { id: id } });
        if (!discount) {
            throw new common_1.NotFoundException(`Discount with ID ${id} not found`);
        }
        try {
            await this.discountRepo.remove(discount);
            return true;
        }
        catch (error) {
            console.error("Error deleting discount:", error.message);
            throw new common_1.InternalServerErrorException('Error deleting discount');
        }
    }
    async applyDiscountToCollection(collectionId, discountData) {
        const collection = await this.collectionRepo.findOne({
            where: { Id: collectionId },
            relations: ['products', 'products.discount'],
        });
        if (!collection) {
            throw new common_1.NotFoundException(`Collection with ID ${collectionId} not found`);
        }
        const existingDiscount = await this.discountRepo.findOne({
            where: {
                discountPercentage: discountData.discountPercentage,
                endDate: discountData.endDate,
            },
        });
        let newDiscount;
        if (existingDiscount) {
            console.log("Using existing discount:", existingDiscount);
            newDiscount = existingDiscount;
        }
        else {
            newDiscount = this.discountRepo.create(discountData);
        }
        for (const product of collection.products) {
            if (product.discount) {
                const discountId = product.discount.id;
                console.log(`Product ID ${product.Id} has an existing discount ${discountId}. Removing it...`);
                product.discount = null;
                await this.productService.editProduct(product.Id, product);
            }
        }
        if (!existingDiscount) {
            console.log("added:", newDiscount);
            await this.discountRepo.save(newDiscount);
        }
        for (const product of collection.products) {
            product.discount = newDiscount;
            console.log("product:", product);
            await this.productService.editProduct(product.Id, product);
        }
        return { success: true, message: `Discount applied to collection and its products.` };
    }
    async deleteExpiredDiscounts() {
        const now = new Date();
        try {
            const expiredDiscounts = await this.discountRepo.find({
                where: { endDate: (0, typeorm_2.LessThan)(now) },
            });
            if (expiredDiscounts.length > 0) {
                await this.discountRepo.remove(expiredDiscounts);
                this.logger.log(`${expiredDiscounts.length} expired discounts deleted.`);
            }
        }
        catch (error) {
            this.logger.error('Error deleting expired discounts:', error.message);
        }
    }
};
exports.DiscountService = DiscountService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscountService.prototype, "deleteExpiredDiscounts", null);
exports.DiscountService = DiscountService = DiscountService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Discount_entity_1.DiscountEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(Collection_entity_1.CollectionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        Product_service_1.ProductService,
        typeorm_2.Repository])
], DiscountService);
//# sourceMappingURL=Discount.service.js.map