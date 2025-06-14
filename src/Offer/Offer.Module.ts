import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './Offer.entity';
import { OfferController } from './Offer.controller';
import { OfferService } from './Offer.service';


@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
