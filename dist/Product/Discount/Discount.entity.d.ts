import { ProductEntity } from '../Product.entity';
export declare class DiscountEntity {
    id: number;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    products: ProductEntity[];
}
