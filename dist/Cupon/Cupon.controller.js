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
exports.CuponController = void 0;
const common_1 = require("@nestjs/common");
const Cupon_service_1 = require("./Cupon.service");
const swagger_1 = require("@nestjs/swagger");
let CuponController = class CuponController {
    constructor(cuponService) {
        this.cuponService = cuponService;
    }
    async getAllCupons() {
        return await this.cuponService.getAllCupons();
    }
    async getCuponById(id) {
        return await this.cuponService.getCuponById(id);
    }
    async createCupon(cuponData) {
        return await this.cuponService.createCupon(cuponData);
    }
    async editCupon(id, cupontData) {
        return await this.cuponService.editCupon(id, cupontData);
    }
    async deleteCupon(id) {
        return await this.cuponService.deleteCupon(id);
    }
};
exports.CuponController = CuponController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CuponController.prototype, "getAllCupons", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CuponController.prototype, "getCuponById", null);
__decorate([
    (0, common_1.Post)('/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CuponController.prototype, "createCupon", null);
__decorate([
    (0, common_1.Put)('/edit/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CuponController.prototype, "editCupon", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CuponController.prototype, "deleteCupon", null);
exports.CuponController = CuponController = __decorate([
    (0, swagger_1.ApiTags)('Cupon'),
    (0, common_1.Controller)('Cupon'),
    __metadata("design:paramtypes", [Cupon_service_1.CuponService])
], CuponController);
//# sourceMappingURL=Cupon.controller.js.map