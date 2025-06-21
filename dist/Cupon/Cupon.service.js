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
var CuponService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuponService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const Cupon_entity_1 = require("./Cupon.entity");
const Order_service_1 = require("../Order/Order.service");
let CuponService = CuponService_1 = class CuponService {
    constructor(cuponRepo, orderService) {
        this.cuponRepo = cuponRepo;
        this.orderService = orderService;
        this.logger = new common_1.Logger(CuponService_1.name);
    }
    async getAllCupons() {
        return await this.cuponRepo.find();
    }
    async getCuponById(id) {
        const cupon = await this.cuponRepo.findOne({ where: { id: id } });
        if (!cupon) {
            throw new common_1.NotFoundException(`Cupon with ID ${id} not found`);
        }
        return cupon;
    }
    async createCupon(cuponData) {
        const existingCupon = await this.cuponRepo.findOne({ where: { name: cuponData.name } });
        if (existingCupon) {
            throw new common_1.ConflictException('Cupon name already exists');
        }
        const cupon = this.cuponRepo.create(cuponData);
        try {
            return await this.cuponRepo.save(cupon);
        }
        catch (error) {
            console.error('Error creating cupon:', error.message);
            throw new common_1.InternalServerErrorException('Error creating cupon');
        }
    }
    async editCupon(id, cuponData) {
        const cupon = await this.cuponRepo.findOne({ where: { id: id } });
        if (!cupon) {
            throw new common_1.NotFoundException(`Cupon with ID ${id} not found`);
        }
        try {
            await this.cuponRepo.update(id, cuponData);
            return await this.cuponRepo.findOne({ where: { id: id } });
        }
        catch (error) {
            console.error("Error updating cupon:", error.message);
            throw new common_1.InternalServerErrorException('Error updating cupon');
        }
    }
    async deleteCupon(id) {
        const cupon = await this.cuponRepo.findOne({ where: { id: id } });
        if (!cupon) {
            throw new common_1.NotFoundException(`cupon with ID ${id} not found`);
        }
        try {
            await this.cuponRepo.remove(cupon);
            return true;
        }
        catch (error) {
            console.error("Error deleting cupon:", error.message);
            throw new common_1.InternalServerErrorException('Error deleting cupon');
        }
    }
    async deleteExpiredCupons() {
        const now = new Date();
        try {
            const expiredCupons = await this.cuponRepo.find({
                where: { endDate: (0, typeorm_2.LessThan)(now) },
            });
            if (expiredCupons.length > 0) {
                await this.cuponRepo.remove(expiredCupons);
                this.logger.log(`${expiredCupons.length} expired cupons deleted.`);
            }
        }
        catch (error) {
            this.logger.error('Error deleting expired cupons:', error.message);
        }
    }
};
exports.CuponService = CuponService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CuponService.prototype, "deleteExpiredCupons", null);
exports.CuponService = CuponService = CuponService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Cupon_entity_1.CuponEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        Order_service_1.OrderService])
], CuponService);
//# sourceMappingURL=Cupon.service.js.map