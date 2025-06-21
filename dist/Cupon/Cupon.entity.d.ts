import { OrderEntity } from 'src/Order/Order.entity';
export declare class CuponEntity {
    id: number;
    name: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    orders: OrderEntity[];
}
