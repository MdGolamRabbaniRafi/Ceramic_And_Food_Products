import { CartEntity } from 'src/Cart/Cart.entity';
import { CategoryEntity } from 'src/Category/Category.entity';
import { OrderEntity } from 'src/Order/Order.entity';
import { DiscountEntity } from './Discount/Discount.entity';
import { ReviewRatingEntity } from 'src/Review And Rating/ReviewRating.entity';
import { WishListEntity } from 'src/WishList/WishList.entity';
import { CollectionEntity } from 'src/Collection/Collection.entity';
import { OrderProductMapperEntity } from 'src/Mapper/Order Product Mapper/OrderProductMapper.entity';
export declare class ProductEntity {
    Id: number;
    name: string;
    desc: string;
    price: number;
    quantity: number;
    image: string;
    isActive: boolean;
    date: Date;
    json_attribute: JsonAttribute;
    carts: CartEntity[];
    orders: OrderEntity[];
    category: CategoryEntity;
    collections: CollectionEntity[];
    ReviewRating: ReviewRatingEntity[];
    wishlist: WishListEntity[];
    discount: DiscountEntity;
    orderProductMappers: OrderProductMapperEntity[];
}
type JsonAttribute = {
    attributes: {
        [key: string]: {
            [subKey: string]: number;
        };
    };
};
export {};
