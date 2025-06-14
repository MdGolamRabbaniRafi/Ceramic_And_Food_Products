import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './Discount.entity';
import { DiscountService } from './Discount.service';
import { DiscountController } from './Discount.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductModule } from '../Product.module';
import { CollectionEntity } from 'src/Collection/Collection.entity';


@Module({
    imports: [

        TypeOrmModule.forFeature([DiscountEntity,CollectionEntity]),
        ScheduleModule.forRoot(),
        ProductModule, 
    ],
    controllers: [DiscountController],
    providers: [DiscountService],
    exports: [DiscountService, TypeOrmModule],  // Export UserService and TypeOrmModule

})
export class DiscountModule { }