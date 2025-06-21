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
exports.ReviewRatingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ReviewRating_entity_1 = require("./ReviewRating.entity");
let ReviewRatingService = class ReviewRatingService {
    constructor(ReviewRatingRepo) {
        this.ReviewRatingRepo = ReviewRatingRepo;
    }
    getHello() {
        return 'Hello ReviewRating!';
    }
    async findById(id) {
        let ReviewRatingEntity = await this.ReviewRatingRepo.findOne({ where: { Id: id } });
        if (ReviewRatingEntity != null) {
            return ReviewRatingEntity;
        }
        return null;
    }
    async SearchByProductID(ProductId) {
        let ReviewRatingEntity = await this.ReviewRatingRepo.find({
            where: {
                product: { Id: ProductId }
            },
            relations: ['user']
        });
        console.log("ReviewRatingEntity: " + ReviewRatingEntity);
        if (ReviewRatingEntity != null) {
            return ReviewRatingEntity;
        }
        return null;
    }
    async findByUserId(UserId, ProductId) {
        let ReviewRatingEntity = await this.ReviewRatingRepo.findOne({
            where: {
                user: { Id: UserId },
                product: { Id: ProductId }
            },
            relations: ['user']
        });
        if (ReviewRatingEntity != null) {
            return ReviewRatingEntity;
        }
        return null;
    }
    async DeleteByUserID(UserId, ProductId) {
        let ReviewRatingEntity = await this.findByUserId(UserId, ProductId);
        if (ReviewRatingEntity != null) {
            const deleteInfo = await this.ReviewRatingRepo.remove(ReviewRatingEntity);
            if (deleteInfo) {
                return true;
            }
            return false;
        }
        return null;
    }
    async averageRating(ProductId) {
        let ReviewRatingEntity = await this.ReviewRatingRepo.find({
            where: {
                product: { Id: ProductId }
            }
        });
        if (ReviewRatingEntity != null) {
            let count = 0;
            let total = 0;
            ReviewRatingEntity.forEach(element => {
                total = element.rating + total;
                count++;
            });
            const average = total / count;
            const averageRounded = average.toFixed(1);
            return parseFloat(averageRounded);
        }
        return null;
    }
    async update(UserId, ProductId, updateData) {
        const ReviewRatingEntity = await this.findByUserId(UserId, ProductId);
        if (ReviewRatingEntity != null) {
            const UpdateReviewRatingEntity = await this.ReviewRatingRepo.update({ user: { Id: UserId }, product: { Id: ProductId } }, updateData);
            console.log("UpdateReviewRatingEntity: " + UpdateReviewRatingEntity);
            return updateData;
        }
        return null;
    }
    async addReviewRating(ReviewRatingEntity) {
        const currentDateTime = new Date();
        ReviewRatingEntity.date = currentDateTime;
        let ReviewRating = await this.ReviewRatingRepo.save(ReviewRatingEntity);
        if (ReviewRating != null) {
            return true;
        }
        return false;
    }
};
exports.ReviewRatingService = ReviewRatingService;
exports.ReviewRatingService = ReviewRatingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ReviewRating_entity_1.ReviewRatingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReviewRatingService);
//# sourceMappingURL=ReviewRating.service.js.map