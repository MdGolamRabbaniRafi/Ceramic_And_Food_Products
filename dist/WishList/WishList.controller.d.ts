import { WishListService } from './WishList.service';
import { WishListEntity } from './WishList.entity';
export declare class WishListController {
    private readonly wishlistService;
    constructor(wishlistService: WishListService);
    wishListProduct(myobj: WishListEntity): Promise<WishListEntity | {
        message: string;
    } | boolean>;
    showWishListProduct(userId: number): Promise<WishListEntity[]>;
    deleteWishListProduct(id: number): Promise<boolean | {
        message: string;
    }>;
}
