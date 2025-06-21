"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Collection_entity_1 = require("./Collection.entity");
const Collection_service_1 = require("./Collection.service");
const Collection_controller_1 = require("./Collection.controller");
const Product_module_1 = require("../Product/Product.module");
const Discount_module_1 = require("../Product/Discount/Discount.module");
let CollectionModule = class CollectionModule {
};
exports.CollectionModule = CollectionModule;
exports.CollectionModule = CollectionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Collection_entity_1.CollectionEntity]),
            Product_module_1.ProductModule,
            Discount_module_1.DiscountModule
        ],
        controllers: [Collection_controller_1.CollectionController],
        providers: [Collection_service_1.CollectionService],
        exports: [typeorm_1.TypeOrmModule],
    })
], CollectionModule);
//# sourceMappingURL=Collection.module.js.map