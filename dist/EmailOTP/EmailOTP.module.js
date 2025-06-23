"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailOTPModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const EmailOTP_controller_1 = require("./EmailOTP.controller");
const EmailOTP_service_1 = require("./EmailOTP.service");
const mailer_1 = require("@nestjs-modules/mailer");
const User_module_1 = require("../User/User.module");
const User_entity_1 = require("../User/User.entity");
const config_1 = require("@nestjs/config");
const EmailOTP_entity_1 = require("./EmailOTP.entity");
const cleanupOTP_service_1 = require("./cleanupOTP.service");
let EmailOTPModule = class EmailOTPModule {
};
exports.EmailOTPModule = EmailOTPModule;
exports.EmailOTPModule = EmailOTPModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([User_entity_1.UserEntity, EmailOTP_entity_1.OTPEntity]),
            config_1.ConfigModule.forRoot(),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('EMAIL_HOST'),
                        port: configService.get('EMAIL_PORT'),
                        secure: true,
                        auth: {
                            user: configService.get('EMAIL_USER'),
                            pass: configService.get('EMAIL_PASS'),
                        },
                        defaults: {
                            from: configService.get('EMAIL_FROM'),
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            User_module_1.UserModule,
        ],
        controllers: [EmailOTP_controller_1.EmailOTPController],
        providers: [EmailOTP_service_1.EmailOTPService, cleanupOTP_service_1.CleanupOTPService],
    })
], EmailOTPModule);
//# sourceMappingURL=EmailOTP.module.js.map