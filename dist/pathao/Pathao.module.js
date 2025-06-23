"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathaoModule = void 0;
const common_1 = require("@nestjs/common");
const pathao_service_1 = require("./pathao.service");
const pathao_controller_1 = require("./pathao.controller");
let PathaoModule = class PathaoModule {
};
exports.PathaoModule = PathaoModule;
exports.PathaoModule = PathaoModule = __decorate([
    (0, common_1.Module)({
        controllers: [pathao_controller_1.PathaoController],
        providers: [pathao_service_1.PathaoService],
    })
], PathaoModule);
//# sourceMappingURL=Pathao.module.js.map