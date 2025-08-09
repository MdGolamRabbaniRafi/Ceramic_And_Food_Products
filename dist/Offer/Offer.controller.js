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
exports.OfferController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const multer_1 = require("multer");
const path_1 = require("path");
const Offer_service_1 = require("./Offer.service");
const swagger_1 = require("@nestjs/swagger");
let OfferController = class OfferController {
    constructor(offerService) {
        this.offerService = offerService;
    }
    async createOffer(file, body) {
        if (!file) {
            throw new Error('No file uploaded.');
        }
        let imageUrl = process.env.Offer_Image_Destination;
        imageUrl = `${imageUrl}${file.filename}`;
        const isProduction = process.env.NODE_ENV === 'production';
        let finalUrl;
        const trimmedPath = imageUrl.replace(process.env.Host_path, '');
        if (isProduction) {
            finalUrl = `${process.env.Host_url}${trimmedPath}`;
        }
        else {
            finalUrl = trimmedPath;
        }
        const detailsObject = JSON.parse(body.Details);
        console.log(detailsObject);
        const data = {
            name: body.name,
            description: body.description,
            image: finalUrl,
            Details: detailsObject,
        };
        console.log(data.Details);
        return this.offerService.createOffer(data);
    }
    async getAllOffers() {
        return this.offerService.getAllOffers();
    }
    async getOfferById(id) {
        return this.offerService.getOfferById(id);
    }
    async updateOffer(file, id, body) {
        if (file != null) {
            let imageUrl = process.env.Offer_Image_Destination;
            imageUrl = `${imageUrl}${file.filename}`;
            const isProduction = process.env.NODE_ENV === 'production';
            let finalUrl;
            const trimmedPath = imageUrl.replace(process.env.Host_path, '');
            if (isProduction) {
                finalUrl = `${process.env.Host_url}${trimmedPath}`;
            }
            else {
                finalUrl = trimmedPath;
            }
            body.image = finalUrl;
        }
        return this.offerService.updateOffer(id, body);
    }
    async deleteOffer(id) {
        return this.offerService.deleteOffer(id);
    }
};
exports.OfferController = OfferController;
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('OfferPicture', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let urlPath = process.env.Offer_Image_Destination;
                if (urlPath.startsWith(process.env.Host_url)) {
                    const localPath = urlPath.replace(process.env.Host_url, process.env.Host_path);
                    const resolvedPath = (0, path_1.resolve)(localPath);
                    if (!fs.existsSync(resolvedPath)) {
                        fs.mkdirSync(resolvedPath, { recursive: true });
                    }
                    cb(null, resolvedPath);
                }
                else {
                    const resolvedPath = (0, path_1.resolve)(urlPath);
                    if (!fs.existsSync(resolvedPath)) {
                        fs.mkdirSync(resolvedPath, { recursive: true });
                    }
                    cb(null, resolvedPath);
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
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "createOffer", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "getAllOffers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "getOfferById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('OfferPicture', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let urlPath = process.env.Offer_Image_Destination;
                if (urlPath.startsWith(process.env.Host_url)) {
                    const localPath = urlPath.replace(process.env.Host_url, process.env.Host_path);
                    const resolvedPath = (0, path_1.resolve)(localPath);
                    if (!fs.existsSync(resolvedPath)) {
                        fs.mkdirSync(resolvedPath, { recursive: true });
                    }
                    cb(null, resolvedPath);
                }
                else {
                    const resolvedPath = (0, path_1.resolve)(urlPath);
                    if (!fs.existsSync(resolvedPath)) {
                        fs.mkdirSync(resolvedPath, { recursive: true });
                    }
                    cb(null, resolvedPath);
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
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "updateOffer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "deleteOffer", null);
exports.OfferController = OfferController = __decorate([
    (0, swagger_1.ApiTags)('offers'),
    (0, common_1.Controller)('offers'),
    __metadata("design:paramtypes", [Offer_service_1.OfferService])
], OfferController);
//# sourceMappingURL=Offer.controller.js.map