import { Repository } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { ProductService } from 'src/Product/Product.service';
import { OrderProductMapperEntity } from 'src/Mapper/Order Product Mapper/OrderProductMapper.entity';
export declare class OrderService {
    private orderRepo;
    private orderProductMapperRepo;
    private readonly productService;
    constructor(orderRepo: Repository<OrderEntity>, orderProductMapperRepo: Repository<OrderProductMapperEntity>, productService: ProductService);
    getHello(): string;
    editOrder(orderId: number, updatedOrderData: any): Promise<string>;
    searchOrder(): Promise<any>;
    addOrder(orderData: any): Promise<string>;
}
