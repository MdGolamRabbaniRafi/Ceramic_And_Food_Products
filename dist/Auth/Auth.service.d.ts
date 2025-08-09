import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/User/User.entity";
import { UserService } from "src/User/User.service";
import { EmailOTPService } from "src/EmailOTP/EmailOTP.service";
import { TokenService } from "./token/token.service";
export declare class AuthService {
    private readonly userService;
    private jwtService;
    private readonly otpService;
    private readonly tokenService;
    constructor(userService: UserService, jwtService: JwtService, otpService: EmailOTPService, tokenService: TokenService);
    validateUser(username: string, password: string): Promise<UserEntity>;
    login(user: UserEntity): Promise<{
        accessToken: string;
        refreshToken: string;
        Id: number;
        name: string;
        email: string;
        address: string;
        phone: string;
        password: string;
        registration_date: Date;
        role: string;
        Image: string;
        isActive: boolean;
        cart: import("../Cart/Cart.entity").CartEntity[];
        order: import("../Cart/Cart.entity").CartEntity[];
        ReviewRating: import("../Review And Rating/ReviewRating.entity").ReviewRatingEntity[];
        wishlist: import("../WishList/WishList.entity").WishListEntity[];
        payment: import("../WishList/WishList.entity").WishListEntity[];
    }>;
    validateRefreshToken(token: string): Promise<any>;
    RefreshToken(refreshToken: string, req: any): Promise<{
        accessToken: string;
    }>;
    SignUpOTPCheck(userEntity: UserEntity): Promise<any>;
    Signup(email: string, otp: string): Promise<any>;
    logout(token: string): Promise<void>;
    GoogleAuth(logindata: any): Promise<{
        accessToken: string;
    } | any>;
    generateRandomPassword(length?: number): Promise<string>;
}
