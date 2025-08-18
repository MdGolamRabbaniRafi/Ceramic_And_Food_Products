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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const Payment_service_1 = require("./Payment.service");
const Payment_entity_1 = require("./Payment.entity");
const path_1 = require("path");
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    getHello() {
        return '';
    }
    async addOrder(paymentData, myfile) {
        let imageUrl = process.env.Payment_Image_Destination;
        imageUrl = `${imageUrl}${myfile.filename}`;
        const trimmedPath = imageUrl.replace(process.env.Host_path, '');
        const isProduction = process.env.NODE_ENV === 'production';
        let finalUrl;
        if (isProduction) {
            finalUrl = `${process.env.Host_url}${trimmedPath}`;
        }
        else {
            finalUrl = trimmedPath;
        }
        const Image = finalUrl;
        paymentData.image = Image;
        return await this.paymentService.add(paymentData);
    }
    async changeStatus(id, status) {
        return this.paymentService.changeStatus(Number(id), status);
    }
    async getAllPayments() {
        return this.paymentService.findAll();
    }
    async getPaymentById(id) {
        return this.paymentService.findOneById(id);
    }
    async removePaymentById(id) {
        return this.paymentService.remove(id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], PaymentController.prototype, "getHello", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
                cb(null, true);
            }
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 1000000 },
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let urlPath = process.env.Payment_Image_Destination;
                if (urlPath.startsWith(process.env.Host_url)) {
                    const localPath = urlPath.replace(process.env.Host_url, process.env.Host_path);
                    cb(null, (0, path_1.resolve)(localPath));
                }
                else {
                    cb(null, (0, path_1.resolve)(urlPath));
                }
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const extension = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${extension}`;
                cb(null, filename);
            },
        }),
    })),
    (0, common_1.Post)('/addPayment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Payment_entity_1.PaymentEntity, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "addOrder", null);
__decorate([
    (0, common_1.Put)('/changeStatus/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Get)('/findAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Get)('/findOne/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Delete)('/remove/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "removePaymentById", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payment'),
    (0, common_1.Controller)('Payment'),
    __metadata("design:paramtypes", [Payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=Payment.controller.js.map