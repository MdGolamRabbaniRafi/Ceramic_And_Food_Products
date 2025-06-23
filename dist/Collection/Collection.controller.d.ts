import { CollectionEntity } from './Collection.entity';
import { CollectionService } from './Collection.service';
export declare class CollectionController {
    private readonly CollectionService;
    constructor(CollectionService: CollectionService);
    getHello(): string;
    SearchByID(Id: number): Promise<any>;
    Search(): Promise<any>;
    addCollection(body: {
        collectionData: CollectionEntity;
        productIds: number[];
    }): Promise<{
        success: boolean;
        message: string;
        missingProductIds?: number[];
    }>;
    editCollection(id: number, body: {
        collectionData: Partial<CollectionEntity>;
        productIds: number[];
    }): Promise<{
        success: boolean;
        message: string;
        missingProductIds?: number[];
    }>;
    deleteCollection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
