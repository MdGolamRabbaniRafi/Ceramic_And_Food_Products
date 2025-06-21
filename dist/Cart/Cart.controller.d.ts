import { CartService } from './Cart.service';
import { CartEntity } from './Cart.entity';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(cartData: any): Promise<{
        success: boolean;
        message: string;
        cart: CartEntity;
    }>;
    getCartByUser(userId: number): Promise<CartEntity[]>;
    deleteCartByUser(userId: number): Promise<{
        success: boolean;
    }>;
    removeProductFromCart(userId: number, productId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    reduceToCart(userId: number, productId: number): Promise<{
        success: boolean;
        message: string;
        cart: CartEntity;
    }>;
    ProductCount(userId: number): Promise<Number>;
}
