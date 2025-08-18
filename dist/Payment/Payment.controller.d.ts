import { PaymentService } from './Payment.service';
import { PaymentEntity } from './Payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getHello(): string;
    addOrder(paymentData: PaymentEntity, myfile: Express.Multer.File): Promise<boolean>;
    changeStatus(id: string, status: string): Promise<boolean>;
    getAllPayments(): Promise<any[]>;
    getPaymentById(id: number): Promise<PaymentEntity>;
    removePaymentById(id: number): Promise<boolean>;
}
