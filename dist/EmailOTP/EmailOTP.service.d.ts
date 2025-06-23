import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/User/User.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OTPEntity } from './EmailOTP.entity';
export declare class EmailOTPService {
    private readonly mailerService;
    private otpRepo;
    private userRepo;
    private readonly configService;
    constructor(mailerService: MailerService, otpRepo: Repository<OTPEntity>, userRepo: Repository<UserEntity>, configService: ConfigService);
    sendOtpEmail(to: string): Promise<any>;
    verifyOtp(email: string, otp: string): Promise<{
        message: string;
        user?: UserEntity;
    }>;
    sendOtpEmailForSignup(userEntity: UserEntity): Promise<any>;
    private generateOtp;
}
