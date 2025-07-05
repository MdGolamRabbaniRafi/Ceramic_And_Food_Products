import { GraphService } from './graph.service';
export declare class GraphController {
    private readonly graphService;
    constructor(graphService: GraphService);
    getMonthlySales(): Promise<any>;
    getSalesByDateRange(startDate: string, endDate: string): Promise<any>;
    getWeeklySales(): Promise<any>;
    getCurrentMonthSales(): Promise<any>;
    getLastSixMonthsSales(): Promise<any[]>;
    getLastTwelveMonthsSales(): Promise<any[]>;
    getCategoriesWithProductCount(): Promise<any[]>;
}
