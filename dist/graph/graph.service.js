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
exports.GraphService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Order_entity_1 = require("../Order/Order.entity");
const typeorm_2 = require("typeorm");
let GraphService = class GraphService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async getMonthlySales() {
        return this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'totalSales')
            .addSelect("TO_CHAR(DATE_TRUNC('month', order.date), 'Month YYYY')", 'month')
            .where('order.status != :status', { status: 'Pending' })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
    }
    async getSalesByDateRange(startDate, endDate) {
        return this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'totalSales')
            .addSelect("TO_CHAR(DATE_TRUNC('month', order.date), 'Month YYYY')", 'month')
            .where('order.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('order.status != :status', { status: 'Pending' })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
    }
};
exports.GraphService = GraphService;
exports.GraphService = GraphService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GraphService);
//# sourceMappingURL=graph.service.js.map