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
exports.GraphController = void 0;
const common_1 = require("@nestjs/common");
const graph_service_1 = require("./graph.service");
const swagger_1 = require("@nestjs/swagger");
let GraphController = class GraphController {
    constructor(graphService) {
        this.graphService = graphService;
    }
    async getMonthlySales() {
        return this.graphService.getMonthlySales();
    }
    async getSalesByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.graphService.getSalesByDateRange(start, end);
    }
    async getWeeklySales() {
        return this.graphService.getCurrentWeekSales();
    }
    async getCurrentMonthSales() {
        return this.graphService.getMonthlySalesOnly();
    }
    async getLastSixMonthsSales() {
        return this.graphService.getLastSixMonthsSales();
    }
    async getLastTwelveMonthsSales() {
        return this.graphService.getLastTwelveMonthsSales();
    }
    async getCategoriesWithProductCount() {
        return await this.graphService.getAllCategoriesWithProductCount();
    }
};
exports.GraphController = GraphController;
__decorate([
    (0, common_1.Get)('monthly'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphController.prototype, "getMonthlySales", null);
__decorate([
    (0, common_1.Get)('date-range'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GraphController.prototype, "getSalesByDateRange", null);
__decorate([
    (0, common_1.Get)('weakly/now'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphController.prototype, "getWeeklySales", null);
__decorate([
    (0, common_1.Get)('monthly/now'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphController.prototype, "getCurrentMonthSales", null);
__decorate([
    (0, common_1.Get)('sales/last-6-months'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphController.prototype, "getLastSixMonthsSales", null);
__decorate([
    (0, common_1.Get)('sales/last-12-months'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphController.prototype, "getLastTwelveMonthsSales", null);
__decorate([
    (0, common_1.Get)('/category-with-product-count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphController.prototype, "getCategoriesWithProductCount", null);
exports.GraphController = GraphController = __decorate([
    (0, swagger_1.ApiTags)('Graph'),
    (0, common_1.Controller)('Graph'),
    __metadata("design:paramtypes", [graph_service_1.GraphService])
], GraphController);
//# sourceMappingURL=graph.controller.js.map