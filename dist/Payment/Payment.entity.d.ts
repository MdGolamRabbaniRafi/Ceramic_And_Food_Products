import { OrderEntity } from 'src/Order/Order.entity';
import { UserEntity } from 'src/User/User.entity';
export declare class PaymentEntity {
    Id: number;
    Pay_amount: number;
    status: string;
    image: string;
    date: Date;
    user: UserEntity;
    userId: number;
    order: OrderEntity;
    orderId: number;
}
