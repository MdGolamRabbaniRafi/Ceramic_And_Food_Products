import { Repository } from 'typeorm';
import { CartEntity } from './Cart.entity';
import { ProductEntity } from 'src/Product/Product.entity';
export declare class CartService {
    private cartRepo;
    private productRepo;
    constructor(cartRepo: Repository<CartEntity>, productRepo: Repository<ProductEntity>);
    findByUserId(userId: number): Promise<CartEntity[]>;
    private calculateDiscountedPrice;
    addToCart(cartData: {
        userId: number;
        productId: number;
    }): Promise<{
        success: boolean;
        message: string;
        cart: CartEntity;
    }>;
    ProductCount(userId: number): Promise<number>;
    reduceToCart(cartData: {
        userId: number;
        productId: number;
    }): Promise<{
        success: boolean;
        message: string;
        cart: CartEntity;
    }>;
    removeProductFromCart(userId: number, productId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteByUserId(userId: number): Promise<boolean>;
}
