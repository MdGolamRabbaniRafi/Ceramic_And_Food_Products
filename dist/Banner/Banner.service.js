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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Banner_entity_1 = require("./Banner.entity");
const fs_1 = require("fs");
const path = require("path");
let BannerService = class BannerService {
    constructor(BannerRepo) {
        this.BannerRepo = BannerRepo;
    }
    getHello() {
        return 'Hello Banner!';
    }
    async findById(id) {
        const bannerEntity = await this.BannerRepo.findOne({ where: { Id: id } });
        if (bannerEntity != null && typeof bannerEntity.path === 'string') {
            const trimmed = bannerEntity.path.trim();
            const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
            bannerEntity.path = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
        }
        return bannerEntity;
    }
    async addSingle(bannerData) {
        const banner = new Banner_entity_1.BannerEntity();
        banner.FileName = bannerData.fileName;
        banner.path = bannerData.path;
        banner.EventLink = bannerData.eventLink;
        const savedBanner = await this.BannerRepo.save(banner);
        return savedBanner;
    }
    async getAll() {
        const response = await this.BannerRepo.find();
        const updatedResponse = response.map((item) => {
            const trimmed = item.path.trim();
            const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
            const finalPath = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
            return {
                ...item,
                path: finalPath,
            };
        });
        return updatedResponse;
    }
    async deleteImageFile(imagePath) {
        if (!imagePath) {
            return { message: 'No image path provided' };
        }
        if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
            imagePath = imagePath.replace('https:/', 'https://');
        }
        const fileName = path.basename(imagePath);
        console.log('basename:', fileName);
        const isProduction = process.env.NODE_ENV === 'production' || process.platform !== 'win32';
        let uploadDir = process.env.Banner_Image_Destination || '';
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
    async editBanner(id, updatedData) {
        const banner = await this.findById(id);
        if (!banner) {
            return { message: 'Banner not found' };
        }
        if (updatedData.fileName && updatedData.path) {
            const oldFilePath = banner.path;
            const deleteFile = await this.deleteImageFile(oldFilePath);
            if (deleteFile.message !== 'File deleted successfully') {
                return deleteFile;
            }
            banner.FileName = updatedData.fileName;
            banner.path = updatedData.path;
            if (updatedData.eventLink) {
                banner.EventLink = updatedData.eventLink;
            }
            const updatedBanner = await this.BannerRepo.save(banner);
            return { message: 'Banner updated successfully', banner: updatedBanner };
        }
        return { message: 'File data not provided' };
    }
    async deleteBanner(id) {
        const banner = await this.findById(id);
        if (!banner) {
            throw new Error('Banner not found');
        }
        const fileDeleted = await this.deleteImageFile(banner.path);
        if (!fileDeleted) {
            console.error('Failed to delete image file:', banner.path);
            return false;
        }
        const deleteResult = await this.BannerRepo.delete(id);
        return deleteResult.affected > 0;
    }
    async forcefullyDelete(id) {
        const banner = await this.findById(id);
        if (!banner) {
            throw new Error('Banner not found');
        }
        const deleteResult = await this.BannerRepo.delete(id);
        return deleteResult.affected > 0;
    }
    async countBanners() {
        return await this.BannerRepo.count();
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Banner_entity_1.BannerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BannerService);
//# sourceMappingURL=Banner.service.js.map