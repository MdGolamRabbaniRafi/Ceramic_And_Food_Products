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
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Collection_entity_1 = require("./Collection.entity");
const Product_entity_1 = require("../Product/Product.entity");
const Discount_entity_1 = require("../Product/Discount/Discount.entity");
let CollectionService = class CollectionService {
    constructor(CollectionRepo, ProductRepo, DiscountRepo) {
        this.CollectionRepo = CollectionRepo;
        this.ProductRepo = ProductRepo;
        this.DiscountRepo = DiscountRepo;
    }
    getHello() {
        return 'Hello Order!';
    }
    async findAll() {
        const collections = await this.CollectionRepo.find({ relations: ['products', 'products.discount'] });
        return collections;
    }
    async findById(id) {
        const collection = await this.CollectionRepo.findOne({ where: { Id: id }, relations: ['products', 'products.discount'] });
        if (!collection) {
            throw new common_1.NotFoundException(`Collection with ID ${id} not found`);
        }
        return collection;
    }
    async addCollection(collectionData, productIds) {
        const products = await this.ProductRepo.findByIds(productIds);
        const foundProductIds = products.map(product => product.Id);
        const missingProductIds = productIds.filter(productId => !foundProductIds.includes(productId));
        if (missingProductIds.length > 0) {
            return {
                success: false,
                message: 'Some products do not exist in the database.',
                missingProductIds
            };
        }
        const newCollection = this.CollectionRepo.create({ ...collectionData, products });
        const savedCollection = await this.CollectionRepo.save(newCollection);
        return {
            success: !!savedCollection,
            message: !!savedCollection ? 'Collection saved successfully.' : 'Failed to save collection.'
        };
    }
    async editCollection(id, collectionData, productIds) {
        const collection = await this.CollectionRepo.findOne({ where: { Id: id }, relations: ['products'] });
        if (!collection) {
            return {
                success: false,
                message: 'Collection not found.'
            };
        }
        const products = await this.ProductRepo.findByIds(productIds);
        const foundProductIds = products.map(product => product.Id);
        const missingProductIds = productIds.filter(productId => !foundProductIds.includes(productId));
        if (missingProductIds.length > 0) {
            return {
                success: false,
                message: 'Some products do not exist in the database.',
                missingProductIds
            };
        }
        collection.name = collectionData.name || collection.name;
        collection.products = products;
        const savedCollection = await this.CollectionRepo.save(collection);
        return {
            success: !!savedCollection,
            message: !!savedCollection ? 'Collection updated successfully.' : 'Failed to update collection.'
        };
    }
    async deleteCollection(id) {
        const collection = await this.CollectionRepo.findOne({ where: { Id: id } });
        if (!collection) {
            return {
                success: false,
                message: 'Collection not found.',
            };
        }
        await this.CollectionRepo.remove(collection);
        return {
            success: true,
            message: 'Collection deleted successfully.',
        };
    }
};
exports.CollectionService = CollectionService;
exports.CollectionService = CollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Collection_entity_1.CollectionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(Product_entity_1.ProductEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(Discount_entity_1.DiscountEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CollectionService);
//# sourceMappingURL=Collection.service.js.map