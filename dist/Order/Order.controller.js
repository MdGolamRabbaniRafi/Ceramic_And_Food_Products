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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const Order_service_1 = require("./Order.service");
const swagger_1 = require("@nestjs/swagger");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    getHello() {
        return this.orderService.getHello();
    }
    async addOrder(OrderData) {
        return await this.orderService.addOrder(OrderData);
    }
    async searchOrder() {
        return await this.orderService.searchOrder();
    }
    async getOrderById(id) {
        return await this.orderService.getOrderById(id);
    }
    async editOrder(id, updatedOrderData) {
        return await this.orderService.editOrder(id, updatedOrderData);
    }
    async changeStatus(id, status) {
        return await this.orderService.changeStatus(id, status);
    }
    async deleteOrder(id) {
        return await this.orderService.deleteOrder(id);
    }
    async getOrdersByUserId(userId) {
        return await this.orderService.getOrdersByUserId(userId);
    }
    async getInactiveOrdersByUserId(userId) {
        return await this.orderService.getInactiveOrdersByUserId(userId);
    }
    async deleteInactiveOrdersByUserId(userId) {
        return await this.orderService.deleteInactiveOrdersByUserId(userId);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], OrderController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addOrder", null);
__decorate([
    (0, common_1.Get)('/search'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "searchOrder", null);
__decorate([
    (0, common_1.Get)('/search/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)('/edit/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "editOrder", null);
__decorate([
    (0, common_1.Put)('/changeStatus/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "deleteOrder", null);
__decorate([
    (0, common_1.Get)('/user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersByUserId", null);
__decorate([
    (0, common_1.Get)('/inactiveOrder/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getInactiveOrdersByUserId", null);
__decorate([
    (0, common_1.Delete)('/inactiveOrder/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "deleteInactiveOrdersByUserId", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('order'),
    (0, common_1.Controller)('Order'),
    __metadata("design:paramtypes", [Order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=Order.controller.js.map