"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
class refreshTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'refreshJwt') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `${process.env.jwt_secret}`,
        });
    }
    async validate(payload) {
        return { user: payload.sub, username: payload.email };
    }
}
exports.refreshTokenStrategy = refreshTokenStrategy;
//# sourceMappingURL=refreshToken.strategy.js.map