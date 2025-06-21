import { EmailOTPService } from './EmailOTP.service';
import { Response } from 'express';
export declare class EmailOTPController {
    private readonly otpService;
    constructor(otpService: EmailOTPService);
    sendOtp(email: string): Promise<any>;
    checkOtp(email: string, otp: string, res: Response): Promise<any>;
}
