import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/User/User.entity';
import { Repository } from 'typeorm';
// import { RedisService } from 'src/auth/Redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { OTPEntity } from './EmailOTP.entity';

@Injectable()
export class EmailOTPService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(OTPEntity)
    private otpRepo: Repository<OTPEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    // private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtpEmail(to: string): Promise<any> {
    // console.log("Sending OTP to email: " + to);

    const user = await this.userRepo.find({ where: { email: to } });
    if (user.length > 0) {
      // If user array is not empty
      try {
        const otp = this.generateOtp();
        const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 30px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #007bff; }
            .header h1 { color: #007bff; font-size: 24px; margin: 0; }
            .content { font-size: 16px; line-height: 1.6; padding: 20px; }
            .otp { font-size: 28px; font-weight: bold; color: #28a745; display: inline-block; padding: 10px; border-radius: 5px; background-color: #e9f5e9; border: 1px solid #d4edda; }
            .footer { margin-top: 30px; font-size: 14px; color: #888; text-align: center; }
            .footer a { color: #007bff; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Forgot Password for E-commerce</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Your OTP code is:</p>
              <p class="otp">${otp}</p>
              <p>This OTP will be valid for the next 3 minutes. You can use this OTP for One time</p>
            </div>
            <div class="footer">
              <p>If you did not request this email, please <a href="#">ignore it</a>.</p>
              <p>For further assistance, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `;
        // console.log("1st check")
        //   console.log("Sending email...");

        const response = await this.mailerService.sendMail({
          from: this.configService.get<string>('EMAIL_FROM'),
          to,
          subject: 'Forget Password for E-commerce',
          html: message,
        });

        // console.log("Email sent successfully"+JSON.stringify(response));

        // await this.redisService.storeOtp(to, otp, 180);
        const expireTime = new Date(Date.now() + 3 * 60 * 1000);
        const newOtp = this.otpRepo.create({
          email: to, // Ensure the property matches your entity's column
          otp: otp, // Ensure this matches your entity's column
          Expire_Time: expireTime,
          User: user.length > 0 ? user[0] : null,
        });
        await this.otpRepo.save(newOtp);
        return 'OTP sent successfully';
      } catch (error) {
        console.error('Error sending OTP email:', error);
        return "Email didn't send: " + error.message;
      }
    } else {
      console.log('No user found with the email: ' + to);
      return 'No user found with the email: ' + to;
    }
  }


  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ message: string; user?: UserEntity }> {
    const storedOtp = await this.otpRepo.findOne({ where: { email : email } });
    console.log('stored:' + storedOtp.otp);
    console.log('otp:' + otp);

    if (!storedOtp) {
      return { message: 'Invalid OTP or OTP expired' };
    }

    if (storedOtp.otp !== otp) {
      //  return { message: 'Invalid OTP. otp:'+otp+" stored otp: "+storedOtp.OTP };
      return { message: 'Invalid OTP.' };
    }

    if (new Date(storedOtp.Expire_Time) < new Date()) {
      return { message: 'OTP expired' };
    }

    const user = storedOtp.User;

    // Delete OTP after successful verification
    await this.otpRepo.delete({ email: email });

    return {
      message: 'OTP verified successfully',
      user: user,
    };
  }

  async sendOtpEmailForSignup(userEntity: UserEntity): Promise<any> {
    try {
      const to = userEntity.email;
      const otp = this.generateOtp();
      const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 30px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #007bff; }
            .header h1 { color: #007bff; font-size: 24px; margin: 0; }
            .content { font-size: 16px; line-height: 1.6; padding: 20px; }
            .otp { font-size: 28px; font-weight: bold; color: #28a745; display: inline-block; padding: 10px; border-radius: 5px; background-color: #e9f5e9; border: 1px solid #d4edda; }
            .footer { margin-top: 30px; font-size: 14px; color: #888; text-align: center; }
            .footer a { color: #007bff; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Signup for E-commerce</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to Signup for E-commerce. Your OTP code is:</p>
              <p class="otp">${otp}</p>
              <p>This OTP will be valid for the next 3 minutes. You can use this OTP for one time only.</p>
            </div>
            <div class="footer">
              <p>If you did not request this email, please <a href="#">ignore it</a>.</p>
              <p>For further assistance, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      console.log('check1');
      console.log('Email User:', this.configService.get<string>('EMAIL_USER'));
      console.log('Email From:', this.configService.get<string>('EMAIL_FROM'));

      const response = await this.mailerService.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject: 'Signup for E-commerce',
        html: message,
      });
      console.log('check2');

      // Store the OTP and user details in Redis
      // await this.redisService.storeOtp(to, otp, 180);
      // const redisResponse = await this.redisService.storeUserDetails(to, userEntity, otp, 300);
      const expireTime = new Date(Date.now() + 3 * 60 * 1000);
      const newOtp = this.otpRepo.create({
        email: to, // Ensure the property matches your entity's column
        otp: otp, // Ensure this matches your entity's column
        Expire_Time: expireTime,
        User: userEntity,
      });
      try {
        await this.otpRepo.save(newOtp);
        return 'OTP sent successfully';
      } catch {
        return 'An error occurred';
      }
      // if (redisResponse.message === 'User details and OTP stored') {
      //   return 'OTP sent successfully';
      // } else {
      //   return "An error occurred";
      // }
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return "Email didn't send: " + error.message;
    }
  }
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
