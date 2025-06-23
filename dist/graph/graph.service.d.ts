import { OrderEntity } from "src/Order/Order.entity";
import { Repository } from "typeorm";
export declare class GraphService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<OrderEntity>);
    getMonthlySales(): Promise<any>;
    getSalesByDateRange(startDate: Date, endDate: Date): Promise<any>;
}
