import { UserEntity } from "src/User/User.entity";
import { ProductEntity } from "src/Product/Product.entity";
export declare class CartEntity {
    Id: number;
    session_id: number;
    date: Date;
    user: UserEntity;
    products: {
        product: ProductEntity;
        quantity: number;
    }[];
}
