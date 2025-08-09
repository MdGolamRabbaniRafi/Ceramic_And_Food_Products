import { CartEntity } from 'src/Cart/Cart.entity';
import { ReviewRatingEntity } from 'src/Review And Rating/ReviewRating.entity';
import { WishListEntity } from 'src/WishList/WishList.entity';
export declare class UserEntity {
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
    cart: CartEntity[];
    order: CartEntity[];
    ReviewRating: ReviewRatingEntity[];
    wishlist: WishListEntity[];
    payment: WishListEntity[];
}
