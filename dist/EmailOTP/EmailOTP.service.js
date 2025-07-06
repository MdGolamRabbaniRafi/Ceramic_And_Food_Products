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
exports.EmailOTPService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../User/User.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const EmailOTP_entity_1 = require("./EmailOTP.entity");
let EmailOTPService = class EmailOTPService {
    constructor(mailerService, otpRepo, userRepo, configService) {
        this.mailerService = mailerService;
        this.otpRepo = otpRepo;
        this.userRepo = userRepo;
        this.configService = configService;
    }
    async sendOtpEmail(to) {
        const user = await this.userRepo.find({ where: { email: to } });
        if (user.length > 0) {
            try {
                const otp = this.generateOtp();
                const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 30px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #007bff; }
            .header h1 { color: #007bff; font-size: 24px; margin: 0; }
            .content { font-size: 16px; line-height: 1.6; padding: 20px; }
            .otp { font-size: 28px; font-weight: bold; color: #28a745; display: inline-block; padding: 10px; border-radius: 5px; background-color: #e9f5e9; border: 1px solid #d4edda; }
            .footer { margin-top: 30px; font-size: 14px; color: #888; text-align: center; }
            .footer a { color: #007bff; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Forgot Password for E-commerce</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Your OTP code is:</p>
              <p class="otp">${otp}</p>
              <p>This OTP will be valid for the next 3 minutes. You can use this OTP for One time</p>
            </div>
            <div class="footer">
              <p>If you did not request this email, please <a href="#">ignore it</a>.</p>
              <p>For further assistance, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `;
                const response = await this.mailerService.sendMail({
                    from: this.configService.get('EMAIL_FROM'),
                    to,
                    subject: 'Forget Password for E-commerce',
                    html: message,
                });
                const expireTime = new Date(Date.now() + 3 * 60 * 1000);
                const newOtp = this.otpRepo.create({
                    email: to,
                    otp: otp,
                    Expire_Time: expireTime,
                    User: user.length > 0 ? user[0] : null,
                });
                await this.otpRepo.save(newOtp);
                return 'OTP sent successfully';
            }
            catch (error) {
                console.error('Error sending OTP email:', error);
                return "Email didn't send: " + error.message;
            }
        }
        else {
            console.log('No user found with the email: ' + to);
            return 'No user found with the email: ' + to;
        }
    }
    async verifyOtp(email, otp) {
        const storedOtp = await this.otpRepo.findOne({ where: { email: email } });
        console.log('stored:' + storedOtp.otp);
        console.log('otp:' + otp);
        if (!storedOtp) {
            return { message: 'Invalid OTP or OTP expired' };
        }
        if (storedOtp.otp !== otp) {
            return { message: 'Invalid OTP.' };
        }
        if (new Date(storedOtp.Expire_Time) < new Date()) {
            return { message: 'OTP expired' };
        }
        const user = storedOtp.User;
        await this.otpRepo.delete({ email: email });
        return {
            message: 'OTP verified successfully',
            user: user,
        };
    }
    async sendOtpEmailForSignup(userEntity) {
        try {
            const to = userEntity.email;
            const otp = this.generateOtp();
            const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 30px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #007bff; }
            .header h1 { color: #007bff; font-size: 24px; margin: 0; }
            .content { font-size: 16px; line-height: 1.6; padding: 20px; }
            .otp { font-size: 28px; font-weight: bold; color: #28a745; display: inline-block; padding: 10px; border-radius: 5px; background-color: #e9f5e9; border: 1px solid #d4edda; }
            .footer { margin-top: 30px; font-size: 14px; color: #888; text-align: center; }
            .footer a { color: #007bff; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Signup for E-commerce</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to Signup for E-commerce. Your OTP code is:</p>
              <p class="otp">${otp}</p>
              <p>This OTP will be valid for the next 3 minutes. You can use this OTP for one time only.</p>
            </div>
            <div class="footer">
              <p>If you did not request this email, please <a href="#">ignore it</a>.</p>
              <p>For further assistance, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `;
            console.log('check1');
            console.log('Email User:', this.configService.get('EMAIL_USER'));
            console.log('Email From:', this.configService.get('EMAIL_FROM'));
            const response = await this.mailerService.sendMail({
                from: this.configService.get('EMAIL_FROM'),
                to,
                subject: 'Signup for E-commerce',
                html: message,
            });
            console.log('check2');
            const expireTime = new Date(Date.now() + 3 * 60 * 1000);
            const newOtp = this.otpRepo.create({
                email: to,
                otp: otp,
                Expire_Time: expireTime,
                User: userEntity,
            });
            try {
                await this.otpRepo.save(newOtp);
                return 'OTP sent successfully';
            }
            catch {
                return 'An error occurred';
            }
        }
        catch (error) {
            console.error('Error sending OTP email:', error);
            return "Email didn't send: " + error.message;
        }
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.EmailOTPService = EmailOTPService;
exports.EmailOTPService = EmailOTPService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(EmailOTP_entity_1.OTPEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(User_entity_1.UserEntity)),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], EmailOTPService);
//# sourceMappingURL=EmailOTP.service.js.map