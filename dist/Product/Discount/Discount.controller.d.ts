import { DiscountService } from './Discount.service';
import { DiscountEntity } from './Discount.entity';
export declare class DiscountController {
    private readonly discountService;
    constructor(discountService: DiscountService);
    getAllDiscounts(): Promise<DiscountEntity[]>;
    getDiscountById(id: number): Promise<DiscountEntity | null>;
    createDiscount(discountData: Partial<DiscountEntity>, productId: number): Promise<DiscountEntity | boolean>;
    editDiscount(id: number, discountData: Partial<DiscountEntity>): Promise<DiscountEntity | boolean>;
    deleteDiscount(id: number): Promise<boolean>;
    applyDiscount(collectionId: number, discountData: Partial<DiscountEntity>): Promise<{
        success: boolean;
        message: string;
    }>;
}
