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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const User_entity_1 = require("../User/User.entity");
const User_service_1 = require("../User/User.service");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const EmailOTP_service_1 = require("../EmailOTP/EmailOTP.service");
const token_service_1 = require("./token/token.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, otpService, tokenService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.tokenService = tokenService;
    }
    async validateUser(username, password) {
        let validate = await this.userService.validate(username, password);
        if (validate != null) {
            return validate;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: {
                role: user.role,
            }
        };
        const accessToken = await this.jwtService.signAsync(payload, { secret: `${process.env.jwt_secret}` });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: `${process.env.jwt_secret}`,
            expiresIn: '1d'
        });
        return {
            ...user,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }
    async validateRefreshToken(token) {
        try {
            const check = jwt.verify(token, `${process.env.jwt_secret}`);
            return check;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async RefreshToken(refreshToken, req) {
        const decoded = await this.validateRefreshToken(refreshToken);
        if (!decoded) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const authorizationHeader = req.headers['authorization'];
        console.log("authorizationHeader:" + authorizationHeader);
        const token = authorizationHeader.split(' ')[1];
        await this.logout(token);
        const payload = { email: decoded.email, sub: { role: decoded.sub.role } };
        const accessToken = await this.jwtService.signAsync(payload, { secret: `${process.env.jwt_secret}` });
        return { accessToken };
    }
    async SignUpOTPCheck(userEntity) {
        const existingUser = await this.userService.findByEmail(userEntity.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const email = userEntity.email;
        const otpResponse = await this.otpService.sendOtpEmailForSignup(userEntity);
        if (otpResponse == 'OTP sent successfully') {
            return { message: "Email sent successfully" };
        }
        return { message: "Does not sent OTP" };
    }
    async Signup(email, otp) {
        const verifyOTP = await this.otpService.verifyOtp(email, otp);
        console.log(verifyOTP.message);
        if (verifyOTP.message == 'OTP verified successfully') {
            const userEntity = new User_entity_1.UserEntity();
            userEntity.name = verifyOTP.user.name;
            userEntity.email = verifyOTP.user.email;
            userEntity.address = verifyOTP.user.address;
            userEntity.phone = verifyOTP.user.phone;
            userEntity.password = verifyOTP.user.password;
            userEntity.registration_date = new Date();
            userEntity.role = verifyOTP.user.role;
            userEntity.Image = verifyOTP.user.Image;
            return await this.userService.SignUp(userEntity);
        }
        else {
            return { message: verifyOTP.message };
        }
    }
    async logout(token) {
        const decoded = this.jwtService.decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp <= currentTime) {
            console.log('Token is already expired');
            return;
        }
        const expiryDate = new Date(decoded.exp * 1000);
        await this.tokenService.saveToken(token, expiryDate);
    }
    async GoogleAuth(logindata) {
        const user = await this.userService.findByEmail(logindata.email);
        if (user) {
            if (user.email == logindata.email) {
                const payload = logindata;
                const accessToken = await this.jwtService.signAsync(payload, { secret: `${process.env.jwt_secret}` });
                const refreshToken = await this.jwtService.signAsync(payload, {
                    secret: `${process.env.jwt_secret}`,
                    expiresIn: '1d'
                });
                return {
                    accessToken,
                    refreshToken
                };
            }
        }
        else {
            try {
                logindata.password = await this.generateRandomPassword();
                logindata.registration_date = new Date();
                if (typeof logindata.password !== 'string') {
                    throw new Error('Password must be a string');
                }
                const response = await this.userService.SignUp(logindata);
                if (response) {
                    const payload = logindata;
                    const accessToken = await this.jwtService.signAsync(payload, { secret: `${process.env.jwt_secret}` });
                    const refreshToken = await this.jwtService.signAsync(payload, {
                        secret: `${process.env.jwt_secret}`,
                        expiresIn: '1d'
                    });
                    return {
                        accessToken,
                        refreshToken
                    };
                }
                else {
                    throw new common_1.InternalServerErrorException("Failed to registration");
                }
            }
            catch (error) {
                console.error('Error during GoogleAuth:', error);
                throw new common_1.InternalServerErrorException("Failed to registration");
            }
        }
    }
    async generateRandomPassword(length = 12) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [User_service_1.UserService,
        jwt_1.JwtService,
        EmailOTP_service_1.EmailOTPService,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=Auth.service.js.map