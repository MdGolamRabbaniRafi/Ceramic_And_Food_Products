import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/User/User.entity";
import { UserService } from "src/User/User.service";
import { AuthController } from "./Auth.controller";
import { AuthService } from "./Auth.service";
import { RolesGaurd } from "./Role/Roles.gaurd";
import { JwtStrategy } from "./Strategies/jwt.stategy";
import { LocalStrategy } from "./Strategies/local.strategy";
import { refreshTokenStrategy } from "./Strategies/refreshToken.strategy";
// import { RedisService } from "./Redis/redis.service";
import { OTPEntity } from "src/EmailOTP/EmailOTP.entity";
import { EmailOTPService } from "src/EmailOTP/EmailOTP.service";
import { TokenModule } from "./token/Token.module";
// import { SimpleJwtGuard, SimpleJwtStrategy } from "./Gaurds/Simple_gaurd";
@Module({
    imports: [
      PassportModule,
      TokenModule,
      //EmailOTPModule,
      JwtModule.register({
        secret: `${process.env.jwt_secret}`,
        signOptions: { expiresIn: '1h' },
      }),
      TypeOrmModule.forFeature([UserEntity,OTPEntity]),
    ],
    providers: [
      AuthService,
      UserService,
      LocalStrategy,
      JwtStrategy,
      // JwtGaurd,
      refreshTokenStrategy,
    //   SimpleJwtStrategy,SimpleJwtGuard,
      RolesGaurd,
      //RedisService,
      EmailOTPService,
    //  TokenService,
    ],
    controllers: [AuthController],
  })
  export class AuthModule {}
  