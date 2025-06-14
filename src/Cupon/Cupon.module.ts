import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuponEntity } from './Cupon.entity';
import { CuponService } from './Cupon.service';
import { CuponController } from './Cupon.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CollectionEntity } from 'src/Collection/Collection.entity';
import { OrderModule } from 'src/Order/Order.module';


@Module({
    imports: [

        TypeOrmModule.forFeature([CuponEntity]),
        ScheduleModule.forRoot(),
        OrderModule, 
    ],
    controllers: [CuponController],
    providers: [CuponService],
    exports: [CuponService, TypeOrmModule],  // Export UserService and TypeOrmModule

})
export class CuponModule { }