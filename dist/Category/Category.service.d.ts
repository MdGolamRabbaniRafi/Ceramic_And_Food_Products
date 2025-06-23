import { Repository } from 'typeorm';
import { CategoryEntity } from './Category.entity';
export declare class CategoryService {
    private categoryRepo;
    constructor(categoryRepo: Repository<CategoryEntity>);
    getHello(): string;
    findById(id: number): Promise<CategoryEntity | {
        message: string;
    }>;
    findAll(): Promise<any[]>;
    addCategory(categoryEntity: CategoryEntity): Promise<CategoryEntity | {
        message: string;
    }>;
    editCategory(id: number, categoryData: Partial<CategoryEntity>): Promise<{
        message: string;
    }>;
    deleteCategory(id: number): Promise<{
        message: string;
    }>;
}
