import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './Payment.entity';
import { PaymentService } from './Payment.service';
import { PaymentController } from './Payment.controller';
import { UserEntity } from 'src/User/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, UserEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
