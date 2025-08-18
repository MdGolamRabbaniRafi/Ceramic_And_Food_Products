import { Repository } from 'typeorm';
import { PaymentEntity } from './Payment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/User/User.entity';
import { OrderEntity } from 'src/Order/Order.entity';
export declare class PaymentService {
    private userRepo;
    private readonly mailerService;
    private readonly configService;
    private orderRepo;
    private paymentRepo;
    constructor(userRepo: Repository<UserEntity>, mailerService: MailerService, configService: ConfigService, orderRepo: Repository<OrderEntity>, paymentRepo: Repository<PaymentEntity>);
    getHello(): string;
    findById(id: number): Promise<PaymentEntity | null>;
    add(paymentEntity: PaymentEntity): Promise<boolean>;
    changeStatus(id: number, status: string): Promise<boolean>;
    findAll(): Promise<any[]>;
    findOneById(id: number): Promise<PaymentEntity>;
    remove(id: number): Promise<boolean>;
}
