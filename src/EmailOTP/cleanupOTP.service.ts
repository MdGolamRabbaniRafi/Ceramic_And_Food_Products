import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Interval } from '@nestjs/schedule';
import { OTPEntity } from './EmailOTP.entity';

@Injectable()
export class CleanupOTPService {
  constructor(
    @InjectRepository(OTPEntity)
    private readonly otpRepository: Repository<OTPEntity>,
  ) {}

  @Interval(60000) // Runs every 60 seconds (1 minute)
  async deleteExpiredTokens() {
    const deleteResult = await this.otpRepository.delete({ Expire_Time: LessThan(new Date()) });
    console.log(`Expired OTPs removed: ${deleteResult.affected}`);
  }
}
