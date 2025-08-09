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
exports.ReviewRatingController = void 0;
const common_1 = require("@nestjs/common");
const ReviewRating_entity_1 = require("./ReviewRating.entity");
const ReviewRating_service_1 = require("./ReviewRating.service");
const swagger_1 = require("@nestjs/swagger");
let ReviewRatingController = class ReviewRatingController {
    constructor(ReviewRatingService) {
        this.ReviewRatingService = ReviewRatingService;
    }
    getHello() {
        return this.ReviewRatingService.getHello();
    }
    async addReviewRating(ReviewRatingData) {
        return await this.ReviewRatingService.addReviewRating(ReviewRatingData);
    }
    async SearchByUserID(userId, productId) {
        return await this.ReviewRatingService.findByUserId(userId, productId);
    }
    async SearchByProductID(productId) {
        return await this.ReviewRatingService.SearchByProductID(productId);
    }
    async update(userId, productId, updateData) {
        return await this.ReviewRatingService.update(userId, productId, updateData);
    }
    async averageRating(productId) {
        return await this.ReviewRatingService.averageRating(productId);
    }
    async DeleteByUserID(userId, productId) {
        return await this.ReviewRatingService.DeleteByUserID(userId, productId);
    }
};
exports.ReviewRatingController = ReviewRatingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ReviewRatingController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('/addReviewRating'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReviewRating_entity_1.ReviewRatingEntity]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "addReviewRating", null);
__decorate([
    (0, common_1.Get)('/search/:userId/:productId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "SearchByUserID", null);
__decorate([
    (0, common_1.Get)('/search/:productId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "SearchByProductID", null);
__decorate([
    (0, common_1.Put)('/update/:userId/:productId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, ReviewRating_entity_1.ReviewRatingEntity]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/averageRating/:productId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "averageRating", null);
__decorate([
    (0, common_1.Delete)('/remove/:userId/:productId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "DeleteByUserID", null);
exports.ReviewRatingController = ReviewRatingController = __decorate([
    (0, swagger_1.ApiTags)('Review Rating'),
    (0, common_1.Controller)('ReviewRating'),
    __metadata("design:paramtypes", [ReviewRating_service_1.ReviewRatingService])
], ReviewRatingController);
//# sourceMappingURL=ReviewRating.controller.js.map