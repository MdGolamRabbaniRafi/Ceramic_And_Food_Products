import { Repository } from 'typeorm';
import { PaymentEntity } from './Payment.entity';
export declare class PaymentService {
    private paymentRepo;
    constructor(paymentRepo: Repository<PaymentEntity>);
    getHello(): string;
    findById(id: number): Promise<PaymentEntity | null>;
    add(PaymentEntity: PaymentEntity): Promise<boolean>;
}
