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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const User_entity_1 = require("../User/User.entity");
const Auth_service_1 = require("./Auth.service");
const jwt_auth_gaurd_1 = require("./Gaurds/jwt-auth.gaurd");
const local_auth_gaurd_1 = require("./Gaurds/local-auth.gaurd");
const refresh_jwt_auth_gaurd_1 = require("./Gaurds/refresh-jwt-auth.gaurd");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(userEntity, req) {
        return await this.authService.login(req.user);
    }
    async SignUp(userEntity, myfile) {
        let imageUrl = process.env.Auth_Image_Destination;
        imageUrl = `${imageUrl}${myfile.filename}`;
        const isProduction = process.env.NODE_ENV === 'production';
        let finalUrl;
        const trimmedPath = imageUrl.replace(process.env.Host_path, '');
        if (isProduction) {
            finalUrl = `https://${trimmedPath}`;
        }
        else {
            finalUrl = trimmedPath;
        }
        userEntity.Image = finalUrl;
        console.log("imageUrl", imageUrl);
        return await this.authService.SignUpOTPCheck(userEntity);
    }
    async checkOtp(email, otp) {
        return await this.authService.Signup(email, otp);
    }
    async RefreshToken(refreshToken, req) {
        return await this.authService.RefreshToken(refreshToken, req);
    }
    async logout(req) {
        const authorizationHeader = req.headers['authorization'];
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            await this.authService.logout(token);
            return { message: 'Logout successful' };
        }
        else {
            return { message: 'Authorization header missing' };
        }
    }
    async GoogleAuth(logindata, myfile) {
        try {
            let imageUrl = process.env.Auth_Image_Destination;
            if (imageUrl.startsWith('https://farseit.com')) {
                imageUrl = `${imageUrl}${myfile.filename}`;
            }
            console.log(logindata);
            const result = await this.authService.GoogleAuth(logindata);
            if (result) {
                return result;
            }
            else {
                throw new common_1.HttpException('UnauthorizedException', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) {
            console.error('Error during GoogleAuth:', error);
            throw new common_1.InternalServerErrorException("Failed to login");
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_auth_gaurd_1.LocalGaurd),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_entity_1.UserEntity, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('defaultPicture', {
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
                let urlPath = process.env.Auth_Image_Destination;
                if (urlPath.startsWith(process.env.Host_url)) {
                    const localPath = urlPath.replace(process.env.Host_url, process.env.Host_path);
                    cb(null, (0, path_1.resolve)(localPath));
                }
                else {
                    cb(null, (0, path_1.resolve)(urlPath));
                }
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${extension}`;
                cb(null, filename);
            }
        })
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_entity_1.UserEntity, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SignUp", null);
__decorate([
    (0, common_1.Post)('/SignupVerifyOTP'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkOtp", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtGaurd),
    (0, common_1.UseGuards)(refresh_jwt_auth_gaurd_1.refreshJwtGaurd),
    (0, common_1.Post)('/RefreshToken'),
    __param(0, (0, common_1.Body)('refreshToken')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "RefreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtGaurd),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('GoogleAuth'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('googlePic', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                cb(null, true);
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 100000 },
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const dest = process.env.Auth_Image_Destination;
                const resolvedDest = (0, path_1.resolve)(dest);
                cb(null, resolvedDest);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${extension}`;
                cb(null, filename);
            },
        })
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GoogleAuth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [Auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=Auth.controller.js.map