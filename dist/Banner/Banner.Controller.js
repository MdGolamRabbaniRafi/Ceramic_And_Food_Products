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
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const Banner_service_1 = require("./Banner.service");
const swagger_1 = require("@nestjs/swagger");
let BannerController = class BannerController {
    constructor(BannerService) {
        this.BannerService = BannerService;
    }
    getHello() {
        return this.BannerService.getHello();
    }
    async getBanners(id) {
        return await this.BannerService.findById(id);
    }
    async add(file, req) {
        const eventLink = req.body.EventLink;
        let imageUrl = process.env.Banner_Image_Destination;
        imageUrl = `${imageUrl}${file.filename}`;
        const trimmedPath = imageUrl.replace(process.env.Host_path, '');
        const isProduction = process.env.NODE_ENV === 'production';
        let finalUrl;
        if (isProduction) {
            finalUrl = `${process.env.Host_url}${trimmedPath}`;
        }
        else {
            finalUrl = trimmedPath;
        }
        const Image = finalUrl;
        console.log('imageUrl', imageUrl);
        const bannerData = {
            fileName: file.filename,
            path: Image,
            eventLink: eventLink,
        };
        return await this.BannerService.addSingle(bannerData);
    }
    async countBanners() {
        return await this.BannerService.countBanners();
    }
    async getAllBanners() {
        return await this.BannerService.getAll();
    }
    async editBanner(id, file, eventLink) {
        let imageUrl = process.env.Banner_Image_Destination;
        imageUrl = `${imageUrl}${file.filename}`;
        const trimmedPath = imageUrl.replace(process.env.Host_path, '');
        const isProduction = process.env.NODE_ENV === 'production';
        let finalUrl;
        if (isProduction) {
            finalUrl = `${process.env.Host_url}${trimmedPath}`;
        }
        else {
            finalUrl = trimmedPath;
        }
        const Image = finalUrl;
        const updatedBannerData = {
            fileName: file ? file.filename : null,
            path: file ? Image : null,
            eventLink,
        };
        return await this.BannerService.editBanner(id, updatedBannerData);
    }
    async deleteBanner(id, res) {
        try {
            const result = await this.BannerService.deleteBanner(id);
            if (result) {
                return res
                    .status(200)
                    .json({ success: true, message: 'Banner deleted successfully' });
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: 'Banner not found or deletion failed',
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred during deletion',
                error: error.message,
            });
        }
    }
    async forcefullyDelete(id, res) {
        try {
            const result = await this.BannerService.forcefullyDelete(id);
            if (result) {
                return res
                    .status(200)
                    .json({ success: true, message: 'Banner deleted successfully' });
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: 'Banner not found or deletion failed',
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred during deletion',
                error: error.message,
            });
        }
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], BannerController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/search/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getBanners", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let urlPath = process.env.Banner_Image_Destination;
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
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('/count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "countBanners", null);
__decorate([
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getAllBanners", null);
__decorate([
    (0, common_1.Put)('/edit/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let urlPath = process.env.Banner_Image_Destination;
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
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('EventLink')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "editBanner", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "deleteBanner", null);
__decorate([
    (0, common_1.Delete)('/forcefullyDelete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "forcefullyDelete", null);
exports.BannerController = BannerController = __decorate([
    (0, swagger_1.ApiTags)('Banner'),
    (0, common_1.Controller)('Banner'),
    __metadata("design:paramtypes", [Banner_service_1.BannerService])
], BannerController);
//# sourceMappingURL=Banner.Controller.js.map