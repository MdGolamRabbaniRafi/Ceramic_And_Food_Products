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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fs_1 = require("fs");
const path = require("path");
const typeorm_2 = require("typeorm");
const Product_entity_1 = require("./Product.entity");
let ProductService = class ProductService {
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    getHello() {
        return 'Hello Product!';
    }
    calculateDiscountedPrice(price, discountPercentage) {
        const discountAmount = price * (discountPercentage / 100);
        return parseFloat((price - discountAmount).toFixed(2));
    }
    async SearchByID(Id) {
        const productEntity = await this.productRepo.findOne({
            where: { Id },
            relations: ['discount', 'category'],
        });
        if (!productEntity) {
            return null;
        }
        if (typeof productEntity.image === 'string') {
            const imageArray = productEntity.image.split(',');
            const updatedImageArray = imageArray.map((imgPath) => {
                const trimmed = imgPath.trim();
                const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
                return `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
            });
            productEntity.image = updatedImageArray.join(',');
        }
        if (productEntity.discount) {
            const discountedPrice = this.calculateDiscountedPrice(productEntity.price, productEntity.discount.discountPercentage);
            productEntity['discountedPrice'] = discountedPrice;
        }
        return {
            ...productEntity,
            image: productEntity.image.split(','),
        };
    }
    async SearchByIDWithoutDiscount(Id) {
        let productEntity = await this.productRepo.findOne({
            where: { Id },
            relations: ['discount', 'category'],
        });
        if (productEntity) {
            return productEntity;
        }
        return null;
    }
    async Search() {
        const productEntities = await this.productRepo.find({
            relations: ['discount', 'category'],
        });
        if (productEntities.length >= 0) {
            productEntities.forEach((product) => {
                if (typeof product.image === 'string') {
                    product.image = product.image
                        .split(',')
                        .map((imgPath) => {
                        const trimmed = imgPath.trim();
                        const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
                        return `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
                    })
                        .join(',');
                }
                if (product.discount) {
                    const discountedPrice = this.calculateDiscountedPrice(product.price, product.discount.discountPercentage);
                    product['discountedPrice'] = discountedPrice;
                }
            });
            return productEntities;
        }
        return null;
    }
    async SearchByCategoryID(categoryId) {
        const productEntities = await this.productRepo.find({
            where: { category: { Id: categoryId } },
            relations: ['discount', 'category'],
        });
        if (productEntities.length > 0) {
            productEntities.forEach((product) => {
                if (typeof product.image === 'string') {
                    const updatedImageArray = product.image.split(',').map((imgPath) => {
                        const trimmed = imgPath.trim();
                        const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
                        return `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
                    });
                    product.image = updatedImageArray.join(',');
                }
                if (product.discount) {
                    const discountedPrice = this.calculateDiscountedPrice(product.price, product.discount.discountPercentage);
                    product['discountedPrice'] = discountedPrice;
                }
            });
            return productEntities.map((product) => ({
                ...product,
                image: product.image.split(','),
            }));
        }
        return null;
    }
    async addProduct(productData) {
        try {
            if (!productData.image || typeof productData.image !== 'string') {
                throw new common_1.BadRequestException('The image field is required and must be a string.');
            }
            if (!productData.name || typeof productData.name !== 'string') {
                throw new common_1.BadRequestException('The name field is required and must be a string.');
            }
            if (!productData.desc || typeof productData.desc !== 'string') {
                throw new common_1.BadRequestException('The desc field is required and must be a string.');
            }
            if (Number.isNaN(productData.price) ||
                productData.price == null ||
                typeof productData.price !== 'number' ||
                productData.price < 0) {
                throw new common_1.BadRequestException('The price field is required and must be a positive number.');
            }
            if (productData.quantity == null ||
                typeof productData.quantity !== 'number' ||
                productData.quantity < 0) {
                throw new common_1.BadRequestException('The quantity field is required and must be a non-negative integer.');
            }
            if (typeof productData.json_attribute === 'string') {
                productData.json_attribute = JSON.parse(productData.json_attribute);
            }
            if (productData.json_attribute &&
                typeof productData.json_attribute === 'object') {
                const attributes = productData.json_attribute
                    .attributes;
                if (!attributes || typeof attributes !== 'object') {
                    throw new common_1.BadRequestException('Invalid attribute structure.');
                }
                let quantityMismatch = false;
                let mismatchAttribute = null;
                for (const [key, value] of Object.entries(attributes)) {
                    if (typeof value !== 'object') {
                        throw new common_1.BadRequestException(`Invalid attribute values for "${key}".`);
                    }
                    let attributeTotal = 0;
                    for (const qty of Object.values(value)) {
                        if (typeof qty !== 'number' || qty < 0) {
                            throw new common_1.BadRequestException(`Invalid quantity in attribute "${key}".`);
                        }
                        attributeTotal += qty;
                    }
                    if (attributeTotal != productData.quantity) {
                        quantityMismatch = true;
                        mismatchAttribute = key;
                        break;
                    }
                }
                if (quantityMismatch) {
                    throw new common_1.BadRequestException('The total quantity for ' +
                        mismatchAttribute +
                        ' does not match the original quantity ' +
                        productData.quantity +
                        '.');
                }
            }
            const productDetails = await this.productRepo.save(productData);
            if (productDetails != null) {
                return productDetails;
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error saving product details:', error.message);
            throw new common_1.InternalServerErrorException('Error saving product details');
        }
    }
    async updateProductQuantity(product) {
        if (product.quantity === undefined ||
            product.json_attribute === undefined) {
            throw new Error('Quantity or JSON attribute not defined.');
        }
        const productRepo = this.productRepo;
        const updatedValues = {
            quantity: product.quantity,
            json_attribute: product.json_attribute,
        };
        await productRepo
            .createQueryBuilder()
            .update(Product_entity_1.ProductEntity)
            .set(updatedValues)
            .where('Id = :Id', { Id: product.Id })
            .execute();
    }
    async editProduct(id, productData) {
        const product = await this.productRepo.findOne({ where: { Id: id } });
        if (!product) {
            return { message: `Product with ID ${id} not found` };
        }
        try {
            if (productData.image != null && typeof productData.image !== 'string')
                return { message: `The image field is required and must be a string.` };
            {
            }
            if (productData.image && product.image !== productData.image) {
                if (product.image) {
                    const imageArray = product.image.split(',');
                    imageArray.forEach(async (img) => {
                        const res = await this.deleteImageFile(img);
                        console.log(product.image);
                        if (res.message != 'File deleted successfully') {
                            return res;
                        }
                    });
                }
            }
            if (productData.name != null && typeof productData.name !== 'string') {
                return { message: `The name field is required and must be a string.` };
            }
            if (productData.desc != null && typeof productData.desc !== 'string') {
                return { message: `The desc field is required and must be a string.` };
            }
            if (productData.price !== undefined) {
                if (Number.isNaN(productData.price) ||
                    typeof productData.price !== 'number' ||
                    productData.price < 0) {
                    return { message: `The price field must be a positive number.` };
                }
            }
            if ((productData.quantity != null &&
                typeof productData.quantity !== 'number') ||
                productData.quantity < 0) {
                return {
                    message: `The quantity field is required and must be a non-negative integer..`,
                };
            }
            if (typeof productData.json_attribute === 'string') {
                productData.json_attribute = JSON.parse(productData.json_attribute);
            }
            if (productData.json_attribute &&
                typeof productData.json_attribute === 'object') {
                const attributes = productData.json_attribute
                    .attributes;
                if (!attributes || typeof attributes !== 'object') {
                    return { message: `Invalid attribute structure.` };
                }
                let quantityMismatch = false;
                let mismatchAttribute = null;
                for (const [key, value] of Object.entries(attributes)) {
                    if (typeof value !== 'object') {
                        return { message: `Invalid attribute values for "${key}".` };
                    }
                    let attributeTotal = 0;
                    for (const qty of Object.values(value)) {
                        if (typeof qty !== 'number' || qty < 0) {
                            return { message: `Invalid quantity in attribute "${key}".` };
                        }
                        attributeTotal += qty;
                    }
                    if (attributeTotal != product.quantity) {
                        quantityMismatch = true;
                        mismatchAttribute = key;
                        break;
                    }
                }
                if (quantityMismatch) {
                    return {
                        message: 'The total quantity for ' +
                            mismatchAttribute +
                            ' does not match the original quantity ' +
                            product.quantity +
                            '.',
                    };
                }
            }
            await this.productRepo.update(id, productData);
            return await this.productRepo.findOne({ where: { Id: id } });
        }
        catch (error) {
            console.error('Error editing product details:', error.message);
            return { message: 'Error editing product details' };
        }
    }
    async deleteProduct(id) {
        const product = await this.productRepo.findOne({ where: { Id: id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.image) {
            const imageArray = product.image.split(',').map((img) => img.trim());
            const deletionResults = await Promise.all(imageArray.map((img) => this.deleteImageFile(img)));
            const failedDeletions = deletionResults.filter((res) => res.message !== 'File deleted successfully');
            if (failedDeletions.length > 0) {
                const failedMessages = failedDeletions
                    .map((res) => res.message)
                    .join('; ');
                return { message: `Product deletion aborted: ${failedMessages}` };
            }
        }
        try {
            await this.productRepo.delete(id);
            return { message: 'Product removed successfully' };
        }
        catch (error) {
            console.error('Error removing product:', error.message);
            throw new common_1.InternalServerErrorException('Error removing product');
        }
    }
    async deleteImageFile(imagePath) {
        console.log('imagePath', imagePath);
        if (!imagePath) {
            return { message: 'No image path provided' };
        }
        if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
            imagePath = imagePath.replace('https:/', 'https://');
        }
        const fileName = path.basename(imagePath);
        console.log('basename:', fileName);
        const isProduction = process.env.NODE_ENV === 'production' || process.platform !== 'win32';
        let uploadDir = process.env.Product_Image_Destination || '';
        if (isProduction &&
            process.env.Host_url &&
            imagePath.startsWith(process.env.Host_url)) {
            uploadDir = process.env.Host_path
                ? path.join(process.env.Host_path, uploadDir.replace(process.env.Host_path, ''))
                : uploadDir;
        }
        const localImagePath = path.join(uploadDir, fileName);
        console.log('Resolved path for deletion:', localImagePath);
        try {
            await fs_1.promises.access(localImagePath);
        }
        catch (err) {
            console.error('File not found:', localImagePath);
            return { message: 'File not found' };
        }
        try {
            await fs_1.promises.unlink(localImagePath);
            console.log('File deleted:', fileName);
            return { message: 'File deleted successfully' };
        }
        catch (err) {
            console.error('Failed to delete:', localImagePath, err);
            return { message: 'Failed to delete file' };
        }
    }
    async ForcefullyDelete(id) {
        const product = await this.productRepo.findOne({ where: { Id: id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        try {
            await this.productRepo.delete(id);
            return { message: 'Product removed successfully' };
        }
        catch (error) {
            console.error('Error removing product:', error.message);
            throw new common_1.InternalServerErrorException('Error removing product');
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=Product.service.js.map