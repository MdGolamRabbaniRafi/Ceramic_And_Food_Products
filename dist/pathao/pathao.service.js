"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathaoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const dotenv = require("dotenv");
dotenv.config();
let PathaoService = class PathaoService {
    constructor() {
        this.apiKey = process.env.PATHAO_API_KEY;
        this.baseUrl = process.env.PATHAO_BASE_URL;
    }
    async createOrder(orderData) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/order/create`, orderData, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("response:" + response.data);
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || 'Error creating order', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PathaoService = PathaoService;
exports.PathaoService = PathaoService = __decorate([
    (0, common_1.Injectable)()
], PathaoService);
//# sourceMappingURL=pathao.service.js.map