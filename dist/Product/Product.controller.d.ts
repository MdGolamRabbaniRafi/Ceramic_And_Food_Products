import { ProductEntity } from './Product.entity';
import { ProductService } from './Product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getHello(): string;
    SearchByID(Id: number): Promise<any>;
    Search(): Promise<{
        message: string;
    } | any[]>;
    SearchByCategoryID(categoryId: number): Promise<any>;
    addProduct(files: Express.Multer.File[], req: any): Promise<boolean | ProductEntity>;
    editProduct(id: number, files: Express.Multer.File[], req: any): Promise<ProductEntity | {
        message: string;
    }>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
    ForcefullyDelete(id: number): Promise<{
        message: string;
    }>;
}
