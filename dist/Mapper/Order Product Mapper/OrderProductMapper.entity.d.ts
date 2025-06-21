import { OrderEntity } from 'src/Order/Order.entity';
import { ProductEntity } from 'src/Product/Product.entity';
export declare class OrderProductMapperEntity {
    Id: number;
    order: OrderEntity;
    product: ProductEntity;
    json_attribute: JSON;
}
