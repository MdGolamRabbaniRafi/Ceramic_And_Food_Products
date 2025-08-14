import { OrderEntity } from './Order.entity';
import { OrderService } from './Order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getHello(): string;
    addOrder(OrderData: any): Promise<OrderEntity | {
        message: String;
    }>;
    searchOrder(): Promise<any>;
    getOrderById(id: number): Promise<any>;
    editOrder(id: number, updatedOrderData: any): Promise<string>;
    changeStatus(id: number, status: string): Promise<OrderEntity | {
        message: string;
    }>;
    deleteOrder(id: number): Promise<string>;
    getOrdersByUserId(userId: number): Promise<OrderEntity[]>;
    getInactiveOrdersByUserId(userId: number): Promise<OrderEntity[]>;
    deleteInactiveOrdersByUserId(userId: number): Promise<string>;
}
