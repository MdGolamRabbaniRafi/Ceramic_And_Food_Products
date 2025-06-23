import { Repository } from 'typeorm';
import { OTPEntity } from './EmailOTP.entity';
export declare class CleanupOTPService {
    private readonly otpRepository;
    constructor(otpRepository: Repository<OTPEntity>);
    deleteExpiredTokens(): Promise<void>;
}
