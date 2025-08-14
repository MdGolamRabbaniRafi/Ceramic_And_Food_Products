import { OrderProductMapperEntity } from 'src/Mapper/Order Product Mapper/OrderProductMapper.entity';
import { ProductService } from 'src/Product/Product.service';
import { Repository } from 'typeorm';
import { OrderEntity } from './Order.entity';
export declare class OrderService {
    private orderRepo;
    private orderProductMapperRepo;
    private readonly productService;
    constructor(orderRepo: Repository<OrderEntity>, orderProductMapperRepo: Repository<OrderProductMapperEntity>, productService: ProductService);
    getHello(): string;
    changeStatus(id: number, status: string): Promise<OrderEntity | {
        message: string;
    }>;
    editOrder(orderId: number, updatedOrderData: any): Promise<string>;
    searchOrder(): Promise<any>;
    getOrderById(id: number): Promise<any>;
    addOrder(orderData: any): Promise<OrderEntity | {
        message: String;
    }>;
    deleteOrder(orderId: number): Promise<string>;
    getOrdersByUserId(userId: number): Promise<OrderEntity[]>;
    getInactiveOrdersByUserId(userId: number): Promise<OrderEntity[]>;
    deleteInactiveOrdersByUserId(userId: number): Promise<string>;
    hasInactiveOrder(userId: number): Promise<boolean>;
}
