import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from './Payment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/User/User.entity';
import { OrderEntity } from 'src/Order/Order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
  ) {}
  getHello(): string {
    return 'Hello Order!';
  }
  async findById(id: number): Promise<PaymentEntity | null> {
    let PaymentEntity = await this.paymentRepo.findOne({ where: { Id: id } });
    if (PaymentEntity != null) {
      return PaymentEntity;
    }
    return null;
  }

  async add(paymentEntity: PaymentEntity): Promise<boolean> {
    // Assign only user id for relation
    paymentEntity.user = await this.userRepo.findOne({
      where: { Id: paymentEntity.userId },
    });

    const userEmail = paymentEntity.user?.email;
    const adminEmail = process.env.Admin_Email;

    if (!userEmail) {
      throw new Error(`User email is missing.`);
    }
    if (!adminEmail) {
      throw new Error(`Admin email is missing.${adminEmail}`);
    }
    if (paymentEntity.orderId) {
      const order = await this.orderRepo.findOne({
        where: { Id: paymentEntity.orderId },
      });
      if (order) {
        order.isActive = true; // Set order as active
        await this.orderRepo.save(order);
      }
    }
    const adminNumber = process.env.Admin_Number;
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
              <h1>Payment verification mail</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your Payment Status is:</p>
              <p class="Payment Status">${paymentEntity.status}</p>
              <p>You need to wait 6 hour until seller approved your payment. you can reach out the admin by contacting to  ${adminNumber}or ${adminEmail}.</p>
            </div>
            <div class="footer">
              <p>If you did not request this email, please <a href="#">ignore it</a>.</p>
              <p>For further assistance, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    const message2 = `
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
              <h1>Payment verification mail</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your Payment Status is:${paymentEntity.status}</p>
              <p>There is a pending Payment of ${paymentEntity.user.name} for order Id ${paymentEntity.orderId}. Please check the link to see that screenshot and confirm the payment.</p>
        <a href=${paymentEntity.image} target="_blank" style="color: #007bff; text-decoration: underline;">View Payment Screenshot</a>


            </div>
            <div class="footer">
              <p>If you did not request this email, please <a href="#">ignore it</a>.</p>
              <p>For further assistance, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    let response, response2;

    try {
      // Send both emails concurrently
      const results = await Promise.allSettled([
        this.mailerService.sendMail({
          from: this.configService.get<string>('EMAIL_FROM'),
          to: userEmail,
          subject: 'Payment verification mail',
          html: message,
        }),
        this.mailerService.sendMail({
          from: this.configService.get<string>('EMAIL_FROM'),
          to: adminEmail,
          subject: 'New Payment Received',
          html: message2,
        }),
      ]);
      // Check if at least one succeeded
      const success = results.some((result) => result.status === 'fulfilled');

      if (!success) {
        console.error('Both emails failed to send:', results);
        return false;
      }

      // Optionally log each result
      results.forEach((result, index) => {
        const recipient = index === 0 ? userEmail : adminEmail;
        if (result.status === 'fulfilled') {
          console.log(`Email sent successfully to ${recipient}`);
        } else {
          console.error(`Failed to send email to ${recipient}:`, result.reason);
        }
      });

      const savedPayment = await this.paymentRepo.save(paymentEntity);
      return !!savedPayment;
    } catch (error) {
      // Log error but do not throw immediately — allow fallback
      console.error('Error sending email(s):', error.message);
    }

    // Proceed only if at least one email was successfully sent
    if (response || response2) {
      const savedPayment = await this.paymentRepo.save(paymentEntity);
      if (savedPayment) {
        return true;
      }
    }

    return false;
  }

  async changeStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await this.paymentRepo.update(id, { status });
      const adminEmail = this.configService.get<string>('EMAIL_FROM');
      const paymentData = await this.paymentRepo.findOne({
        where: { Id: id },
        relations: ['user'],
      });
      if (paymentData.orderId) {
        await this.orderRepo.update(paymentData.orderId, {
          status: 'shipped',
          isActive: true,
        });
      }
      const adminNumber = process.env.Admin_Number;
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
              <h1>Payment verification mail</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>The Payment Status is changed to:${status} for your order. you can reach out the admin by contacting to  ${adminNumber} or ${adminEmail}.</p>
            </div>
            <div class="footer">
              <p>If you did not request this email, please <a href="#">ignore it</a>.</p>
              <p>For further assistance, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      const results = await Promise.allSettled([
        this.mailerService.sendMail({
          from: adminEmail,
          to: paymentData.user.email,
          subject: 'Payment verification mail',
          html: message,
        }),
      ]);
      return result.affected > 0;
    } catch {}
  }
  async findAll(): Promise<any[]> {
    return this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoin('payment.user', 'user')
      .select(['payment', 'user.name'])
      .getMany();
  }

  async findOneById(id: number): Promise<PaymentEntity> {
    return await this.paymentRepo.findOne({
      where: { Id: id },
      relations: ['user', 'order'],
    });
  }

  async remove(id: number): Promise<boolean> {
    try {
      // Find the payment first
      const payment = await this.paymentRepo.findOne({ where: { Id: id } });

      if (!payment) {
        console.error(`Payment with Id ${id} not found.`);
        return false; // or throw new NotFoundException(`Payment not found`);
      }

      // Optionally, you could notify the user/admin here before deletion

      // Delete the payment
      const result = await this.paymentRepo.delete(id);

      return result.affected > 0; // true if deleted, false otherwise
    } catch (error) {
      console.error(`Error deleting payment with Id ${id}:`, error.message);
      return false;
    }
  }
}
