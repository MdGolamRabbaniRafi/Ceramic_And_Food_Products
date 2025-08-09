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
exports.DiscountController = void 0;
const common_1 = require("@nestjs/common");
const Discount_service_1 = require("./Discount.service");
const swagger_1 = require("@nestjs/swagger");
let DiscountController = class DiscountController {
    constructor(discountService) {
        this.discountService = discountService;
    }
    async getAllDiscounts() {
        return await this.discountService.getAllDiscounts();
    }
    async getDiscountById(id) {
        return await this.discountService.getDiscountById(id);
    }
    async createDiscount(discountData, productId) {
        return await this.discountService.createDiscount(discountData, productId);
    }
    async editDiscount(id, discountData) {
        return await this.discountService.editDiscount(id, discountData);
    }
    async deleteDiscount(id) {
        return await this.discountService.deleteDiscount(id);
    }
    async applyDiscount(collectionId, discountData) {
        return await this.discountService.applyDiscountToCollection(collectionId, discountData);
    }
};
exports.DiscountController = DiscountController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "getAllDiscounts", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "getDiscountById", null);
__decorate([
    (0, common_1.Post)('/add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "createDiscount", null);
__decorate([
    (0, common_1.Put)('/edit/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "editDiscount", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "deleteDiscount", null);
__decorate([
    (0, common_1.Post)('/apply-discount/:collectionId'),
    __param(0, (0, common_1.Param)('collectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "applyDiscount", null);
exports.DiscountController = DiscountController = __decorate([
    (0, swagger_1.ApiTags)('Discount'),
    (0, common_1.Controller)('Discount'),
    __metadata("design:paramtypes", [Discount_service_1.DiscountService])
], DiscountController);
//# sourceMappingURL=Discount.controller.js.map