"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../User/User.entity");
const User_service_1 = require("../User/User.service");
const Auth_controller_1 = require("./Auth.controller");
const Auth_service_1 = require("./Auth.service");
const Roles_gaurd_1 = require("./Role/Roles.gaurd");
const jwt_stategy_1 = require("./Strategies/jwt.stategy");
const local_strategy_1 = require("./Strategies/local.strategy");
const refreshToken_strategy_1 = require("./Strategies/refreshToken.strategy");
const EmailOTP_entity_1 = require("../EmailOTP/EmailOTP.entity");
const EmailOTP_service_1 = require("../EmailOTP/EmailOTP.service");
const Token_module_1 = require("./token/Token.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            Token_module_1.TokenModule,
            jwt_1.JwtModule.register({
                secret: `${process.env.jwt_secret}`,
                signOptions: { expiresIn: '1h' },
            }),
            typeorm_1.TypeOrmModule.forFeature([User_entity_1.UserEntity, EmailOTP_entity_1.OTPEntity]),
        ],
        providers: [
            Auth_service_1.AuthService,
            User_service_1.UserService,
            local_strategy_1.LocalStrategy,
            jwt_stategy_1.JwtStrategy,
            refreshToken_strategy_1.refreshTokenStrategy,
            Roles_gaurd_1.RolesGaurd,
            EmailOTP_service_1.EmailOTPService,
        ],
        controllers: [Auth_controller_1.AuthController],
    })
], AuthModule);
//# sourceMappingURL=Auth.module.js.map