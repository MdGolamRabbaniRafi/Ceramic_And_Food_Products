import { ProductEntity } from "src/Product/Product.entity";
import { UserEntity } from "src/User/User.entity";
export declare class WishListEntity {
    Id: number;
    date: Date;
    product: ProductEntity;
    user: UserEntity;
}
