import { OrderEntity } from './Order.entity';
import { OrderService } from './Order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getHello(): string;
    addOrder(OrderData: any): Promise<string>;
    searchOrder(): Promise<any>;
    getOrderById(id: number): Promise<any>;
    editOrder(id: number, updatedOrderData: any): Promise<string>;
    changeStatus(id: number, status: any): Promise<OrderEntity | {
        message: string;
    }>;
    deleteOrder(id: number): Promise<string>;
}
