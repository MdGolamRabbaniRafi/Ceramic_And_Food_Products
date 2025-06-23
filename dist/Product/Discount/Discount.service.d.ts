import { Repository } from 'typeorm';
import { DiscountEntity } from './Discount.entity';
import { ProductService } from '../Product.service';
import { CollectionEntity } from 'src/Collection/Collection.entity';
export declare class DiscountService {
    private discountRepo;
    private readonly productService;
    private collectionRepo;
    private readonly logger;
    constructor(discountRepo: Repository<DiscountEntity>, productService: ProductService, collectionRepo: Repository<CollectionEntity>);
    getAllDiscounts(): Promise<DiscountEntity[]>;
    getDiscountById(id: number): Promise<DiscountEntity | null>;
    createDiscount(discountData: Partial<DiscountEntity>, productId: number): Promise<DiscountEntity | boolean>;
    editDiscount(id: number, discountData: Partial<DiscountEntity>): Promise<DiscountEntity | boolean>;
    deleteDiscount(id: number): Promise<boolean>;
    applyDiscountToCollection(collectionId: number, discountData: Partial<DiscountEntity>): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteExpiredDiscounts(): Promise<void>;
}
