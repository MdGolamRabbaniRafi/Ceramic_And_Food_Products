import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './Order.entity';
import { OrderController } from './Order.controller';
import { OrderService } from './Order.service';
import { ProductModule } from 'src/Product/Product.module';
import { OrderProductMapperEntity } from 'src/Mapper/Order Product Mapper/OrderProductMapper.entity';
import { OrderCleanupService } from './Order.cleanup';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderProductMapperEntity]),
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderCleanupService],
  exports: [OrderService, TypeOrmModule],
})
export class OrderModule {}
