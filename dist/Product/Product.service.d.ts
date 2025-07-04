import { Repository } from 'typeorm';
import { ProductEntity } from './Product.entity';
export declare class ProductService {
    private productRepo;
    constructor(productRepo: Repository<ProductEntity>);
    getHello(): string;
    private calculateDiscountedPrice;
    SearchByID(Id: number): Promise<any | null>;
    SearchByIDWithoutDiscount(Id: number): Promise<ProductEntity | null>;
    Search(): Promise<ProductEntity[] | null>;
    SearchByCategoryID(categoryId: number): Promise<any[] | null>;
    addProduct(productData: Partial<ProductEntity>): Promise<ProductEntity | boolean>;
    updateProductQuantity(product: Partial<ProductEntity>): Promise<void>;
    editProduct(id: number, productData: Partial<ProductEntity>): Promise<ProductEntity | {
        message: string;
    }>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
    deleteImageFile(imagePath: string): Promise<{
        message: string;
    }>;
    ForcefullyDelete(id: number): Promise<{
        message: string;
    }>;
}
