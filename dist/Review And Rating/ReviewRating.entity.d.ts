import { ProductEntity } from "src/Product/Product.entity";
import { UserEntity } from "src/User/User.entity";
export declare class ReviewRatingEntity {
    Id: number;
    date: Date;
    review: string;
    rating: number;
    product: ProductEntity;
    user: UserEntity;
}
