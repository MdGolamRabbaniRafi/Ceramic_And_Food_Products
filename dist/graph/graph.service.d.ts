import { CategoryEntity } from 'src/Category/Category.entity';
import { OrderEntity } from 'src/Order/Order.entity';
import { Repository } from 'typeorm';
export declare class GraphService {
    private readonly orderRepository;
    private readonly categoryRepo;
    constructor(orderRepository: Repository<OrderEntity>, categoryRepo: Repository<CategoryEntity>);
    getMonthlySales(): Promise<any>;
    getSalesByDateRange(startDate: Date, endDate: Date): Promise<any>;
    getCurrentWeekSales(): Promise<any>;
    getMonthlySalesOnly(): Promise<any>;
    getLastSixMonthsSales(): Promise<any[]>;
    getLastTwelveMonthsSales(): Promise<any[]>;
    getAllCategoriesWithProductCount(): Promise<any[]>;
}
