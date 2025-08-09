import { Repository } from 'typeorm';
import { PaymentEntity } from './Payment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/User/User.entity';
export declare class PaymentService {
    private userRepo;
    private readonly mailerService;
    private readonly configService;
    private paymentRepo;
    constructor(userRepo: Repository<UserEntity>, mailerService: MailerService, configService: ConfigService, paymentRepo: Repository<PaymentEntity>);
    getHello(): string;
    findById(id: number): Promise<PaymentEntity | null>;
    add(paymentEntity: PaymentEntity): Promise<boolean>;
    changeStatus(id: number, status: string): Promise<boolean>;
    findAll(): Promise<PaymentEntity[]>;
    findOneById(id: number): Promise<PaymentEntity>;
}
