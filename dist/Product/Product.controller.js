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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const Product_service_1 = require("./Product.service");
const swagger_1 = require("@nestjs/swagger");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    getHello() {
        return this.productService.getHello();
    }
    async SearchByID(Id) {
        const product = await this.productService.SearchByID(Id);
        if (product) {
            return product;
        }
        return { message: 'Product not found' };
    }
    async Search() {
        const productEntities = await this.productService.Search();
        if (productEntities) {
            const productsWithImages = productEntities.map((product) => {
                return {
                    ...product,
                    image: product.image.split(','),
                };
            });
            return productsWithImages;
        }
        return null;
    }
    async SearchByCategoryID(categoryId) {
        const products = await this.productService.SearchByCategoryID(categoryId);
        if (products) {
            return products;
        }
        return { message: 'No products found in this category' };
    }
    async addProduct(files, req) {
        const { name, desc, price, quantity, date, json_attribute, categoryId } = req.body;
        let imageUrls = '';
        const urls = files.map((file) => {
            let imageBaseUrl = process.env.Product_Image_Destination;
            imageBaseUrl = `${imageBaseUrl}${file.filename}`;
            const trimmedPath = imageBaseUrl.replace(process.env.Host_path, '');
            const isProduction = process.env.NODE_ENV === 'production';
            let finalUrl;
            if (isProduction) {
                finalUrl = `${process.env.Host_url}${trimmedPath}`;
            }
            else {
                finalUrl = trimmedPath;
            }
            imageUrls += (imageUrls ? ',' : '') + finalUrl;
        });
        const productData = {
            name,
            desc,
            price: Number(price),
            quantity: Number(quantity),
            date: new Date(date),
            json_attribute,
            category: { Id: categoryId },
            image: imageUrls,
        };
        return await this.productService.addProduct(productData);
    }
    async editProduct(id, files, req) {
        let imageUrls = '';
        const urls = files.map((file) => {
            let imageBaseUrl = process.env.Product_Image_Destination;
            imageBaseUrl = `${imageBaseUrl}${file.filename}`;
            const trimmedPath = imageBaseUrl.replace(process.env.Host_path, '');
            const isProduction = process.env.NODE_ENV === 'production';
            let finalUrl;
            if (isProduction) {
                finalUrl = `${process.env.Host_url}${trimmedPath}`;
            }
            else {
                finalUrl = trimmedPath;
            }
            imageUrls += (imageUrls ? ',' : '') + finalUrl;
        });
        const productData = {
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price !== undefined && req.body.price !== ''
                ? Number(req.body.price)
                : undefined,
            quantity: req.body.quantity !== undefined && req.body.quantity !== ''
                ? Number(req.body.quantity)
                : undefined,
            json_attribute: req.body.json_attribute,
            ...(req.body.categoryId && {
                category: { Id: req.body.categoryId },
            }),
            image: files.length > 0 ? imageUrls : undefined,
        };
        return await this.productService.editProduct(id, productData);
    }
    async deleteProduct(id) {
        return await this.productService.deleteProduct(id);
    }
    async ForcefullyDelete(id) {
        return await this.productService.ForcefullyDelete(id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ProductController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/search/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "SearchByID", null);
__decorate([
    (0, common_1.Get)('/search'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "Search", null);
__decorate([
    (0, common_1.Get)('/search/category/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "SearchByCategoryID", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('ProductPicture', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let urlPath = process.env.Product_Image_Destination;
                if (urlPath.startsWith(process.env.Host_url)) {
                    const localPath = urlPath.replace(process.env.Host_url, process.env.Host_path);
                    cb(null, (0, path_1.resolve)(localPath));
                }
                else {
                    cb(null, (0, path_1.resolve)(urlPath));
                }
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const extension = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${extension}`;
                cb(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Put)('/edit/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('ProductPicture', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let urlPath = process.env.Product_Image_Destination;
                if (urlPath.startsWith(process.env.Host_url)) {
                    const localPath = urlPath.replace(process.env.Host_url, process.env.Host_path);
                    cb(null, (0, path_1.resolve)(localPath));
                }
                else {
                    cb(null, (0, path_1.resolve)(urlPath));
                }
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const extension = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${extension}`;
                cb(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "editProduct", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Delete)('/ForcefullyDelete/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "ForcefullyDelete", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('Product'),
    (0, common_1.Controller)('Product'),
    __metadata("design:paramtypes", [Product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=Product.controller.js.map