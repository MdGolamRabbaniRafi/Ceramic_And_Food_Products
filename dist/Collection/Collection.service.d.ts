import { Repository } from 'typeorm';
import { CollectionEntity } from './Collection.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { DiscountEntity } from 'src/Product/Discount/Discount.entity';
export declare class CollectionService {
    private CollectionRepo;
    private ProductRepo;
    private DiscountRepo;
    constructor(CollectionRepo: Repository<CollectionEntity>, ProductRepo: Repository<ProductEntity>, DiscountRepo: Repository<DiscountEntity>);
    getHello(): string;
    findAll(): Promise<CollectionEntity[]>;
    findById(id: number): Promise<CollectionEntity | null>;
    addCollection(collectionData: Partial<CollectionEntity>, productIds: number[]): Promise<{
        success: boolean;
        message: string;
        missingProductIds?: number[];
    }>;
    editCollection(id: number, collectionData: Partial<CollectionEntity>, productIds: number[]): Promise<{
        success: boolean;
        message: string;
        missingProductIds?: number[];
    }>;
    deleteCollection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
