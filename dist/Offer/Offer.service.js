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
exports.OfferService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Offer_entity_1 = require("./Offer.entity");
const fs_1 = require("fs");
const path = require("path");
let OfferService = class OfferService {
    constructor(offerRepository) {
        this.offerRepository = offerRepository;
    }
    async createOffer(data) {
        const offer = this.offerRepository.create(data);
        return await this.offerRepository.save(offer);
    }
    async deleteImageFile(imagePath) {
        if (!imagePath) {
            return { message: 'No image path provided' };
        }
        if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
            imagePath = imagePath.replace('https:/', 'https://');
        }
        const fileName = path.basename(imagePath);
        const isProduction = process.env.NODE_ENV === 'production' || process.platform !== 'win32';
        let uploadDir = process.env.Offer_Image_Destination || '';
        if (isProduction &&
            process.env.Host_url &&
            imagePath.startsWith(process.env.Host_url)) {
            uploadDir = process.env.Host_path
                ? path.join(process.env.Host_path, uploadDir.replace(process.env.Host_path, ''))
                : uploadDir;
        }
        const localImagePath = path.join(uploadDir, fileName);
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
    async getAllOffers() {
        const offers = await this.offerRepository.find();
        const updatedOffers = offers.map((offer) => {
            if (typeof offer.image === 'string') {
                const trimmed = offer.image.trim();
                const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
                offer.image = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
            }
            return offer;
        });
        return updatedOffers;
    }
    async getOfferById(id) {
        const offer = await this.offerRepository.findOne({ where: { id } });
        if (!offer) {
            return { message: 'Not found' };
        }
        if (typeof offer.image === 'string') {
            const trimmed = offer.image.trim();
            const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
            offer.image = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
        }
        return offer;
    }
    async updateOffer(id, data) {
        if (data.image !== undefined) {
            const offer = await this.getOfferById(id);
            if ('message' in offer) {
                return offer;
            }
            const check = await this.deleteImageFile(offer.image);
            if (check.message != 'File deleted successfully') {
                return { message: check.message };
            }
        }
        await this.offerRepository.update(id, data);
        return await this.getOfferById(id);
    }
    async deleteOffer(id) {
        const offer = await this.getOfferById(id);
        if ('message' in offer) {
            return { message: offer.message, success: false };
        }
        if (offer.image) {
            const check = await this.deleteImageFile(offer.image);
            if (check.message != 'File deleted successfully') {
                return { message: check.message, success: false };
            }
        }
        try {
            await this.offerRepository.delete(id);
            return {
                message: `Offer with ID ${id} deleted successfully.`,
                success: true,
            };
        }
        catch (error) {
            return { message: 'Error removing offer', success: false };
        }
    }
    async forceullyDelete(id) {
        const offer = await this.getOfferById(id);
        if ('message' in offer) {
            return { message: offer.message, success: false };
        }
        try {
            await this.offerRepository.delete(id);
            return {
                message: `Offer with ID ${id} deleted successfully.`,
                success: true,
            };
        }
        catch (error) {
            return { message: 'Error removing offer', success: false };
        }
    }
};
exports.OfferService = OfferService;
exports.OfferService = OfferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Offer_entity_1.OfferEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OfferService);
//# sourceMappingURL=Offer.service.js.map