"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Discount_entity_1 = require("./Discount.entity");
const Discount_service_1 = require("./Discount.service");
const Discount_controller_1 = require("./Discount.controller");
const schedule_1 = require("@nestjs/schedule");
const Product_module_1 = require("../Product.module");
const Collection_entity_1 = require("../../Collection/Collection.entity");
let DiscountModule = class DiscountModule {
};
exports.DiscountModule = DiscountModule;
exports.DiscountModule = DiscountModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Discount_entity_1.DiscountEntity, Collection_entity_1.CollectionEntity]),
            schedule_1.ScheduleModule.forRoot(),
            Product_module_1.ProductModule,
        ],
        controllers: [Discount_controller_1.DiscountController],
        providers: [Discount_service_1.DiscountService],
        exports: [Discount_service_1.DiscountService, typeorm_1.TypeOrmModule],
    })
], DiscountModule);
//# sourceMappingURL=Discount.module.js.map