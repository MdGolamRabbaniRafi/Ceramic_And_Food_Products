import { OrderService } from './Order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getHello(): string;
    addOrder(OrderData: any): Promise<string>;
    searchOrder(): Promise<any>;
    editOrder(id: number, updatedOrderData: any): Promise<string>;
}
