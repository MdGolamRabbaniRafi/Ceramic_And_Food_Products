import { OrderEntity } from "src/Order/Order.entity";
export declare class PaymentEntity {
    Id: number;
    Pay_amount: number;
    status: string;
    date: Date;
    Method: string;
    order: OrderEntity;
}
