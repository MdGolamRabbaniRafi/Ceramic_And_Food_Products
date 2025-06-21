import { CategoryEntity } from './Category.entity';
import { CategoryService } from './Category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getHello(): string;
    SearchByID(Id: number): Promise<any>;
    Search(): Promise<any>;
    addCategory(CategoryData: CategoryEntity): Promise<CategoryEntity | {
        message: string;
    }>;
    editCategory(Id: number, categoryData: Partial<CategoryEntity>): Promise<{
        message: string;
    }>;
    deleteCategory(Id: number): Promise<{
        message: string;
    }>;
}
