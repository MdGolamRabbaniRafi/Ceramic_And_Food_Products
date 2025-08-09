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
exports.EmailOTPController = void 0;
const common_1 = require("@nestjs/common");
const EmailOTP_service_1 = require("./EmailOTP.service");
const swagger_1 = require("@nestjs/swagger");
let EmailOTPController = class EmailOTPController {
    constructor(otpService) {
        this.otpService = otpService;
    }
    async sendOtp(email) {
        return await this.otpService.sendOtpEmail(email);
    }
    async checkOtp(email, otp, res) {
        const result = await this.otpService.verifyOtp(email, otp);
        if (result.message === 'OTP verified successfully') {
            return res.json({ message: result });
        }
        return res.status(400).json({ message: result });
    }
};
exports.EmailOTPController = EmailOTPController;
__decorate([
    (0, common_1.Post)('/forgetPassword'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailOTPController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('/check'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('otp')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EmailOTPController.prototype, "checkOtp", null);
exports.EmailOTPController = EmailOTPController = __decorate([
    (0, swagger_1.ApiTags)('Email'),
    (0, common_1.Controller)('EmailOTP'),
    __metadata("design:paramtypes", [EmailOTP_service_1.EmailOTPService])
], EmailOTPController);
//# sourceMappingURL=EmailOTP.controller.js.map