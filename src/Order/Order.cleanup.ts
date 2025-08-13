import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Interval } from '@nestjs/schedule';
import { OrderEntity } from './Order.entity';

@Injectable()
export class OrderCleanupService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  @Interval(60000) // Runs every 60 seconds (1 minute)
  async deleteExpiredOrders() {
    const deleteResponse = await this.orderRepository.delete({
      expireTime: LessThan(new Date()),
      isActive: false,
    });

    console.log('Expired Orders removed:', deleteResponse.affected);
  }
}
