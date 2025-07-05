import { UserEntity } from 'src/User/User.entity';
import { AuthService } from './Auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(userEntity: UserEntity, req: any): Promise<{
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
        cart: import("../Cart/Cart.entity").CartEntity[];
        order: import("../Cart/Cart.entity").CartEntity[];
        ReviewRating: import("../Review And Rating/ReviewRating.entity").ReviewRatingEntity[];
        wishlist: import("../WishList/WishList.entity").WishListEntity[];
    }>;
    SignUp(userEntity: UserEntity, myfile: Express.Multer.File): Promise<any>;
    checkOtp(email: string, otp: string): Promise<any>;
    RefreshToken(refreshToken: string, req: any): Promise<{
        accessToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    GoogleAuth(logindata: any, myfile: Express.Multer.File): Promise<any>;
}
