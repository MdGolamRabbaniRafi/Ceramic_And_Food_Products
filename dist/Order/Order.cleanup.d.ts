import { Repository } from 'typeorm';
import { OrderEntity } from './Order.entity';
export declare class OrderCleanupService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<OrderEntity>);
    deleteExpiredOrders(): Promise<void>;
}
