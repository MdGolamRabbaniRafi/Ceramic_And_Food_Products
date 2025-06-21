import { Repository } from 'typeorm';
import { WishListEntity } from './WishList.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { UserEntity } from 'src/User/User.entity';
export declare class WishListService {
    private productRepo;
    private wishlistRepo;
    private userRepo;
    constructor(productRepo: Repository<ProductEntity>, wishlistRepo: Repository<WishListEntity>, userRepo: Repository<UserEntity>);
    wishListProduct(myobj: {
        product: number;
        user: number;
    }): Promise<WishListEntity | {
        message: string;
    } | boolean>;
    showWishListProduct(username: number): Promise<WishListEntity[]>;
    deleteWishListProduct(id: number): Promise<boolean | {
        message: string;
    }>;
}
