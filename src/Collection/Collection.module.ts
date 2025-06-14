import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './Collection.entity';
import { CollectionService } from './Collection.service';
import { CollectionController } from './Collection.controller';
import { ProductModule } from '../Product/Product.module';  // Import ProductModule
import { DiscountModule } from 'src/Product/Discount/Discount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionEntity]),
    ProductModule,  // Import the module that exports the ProductEntity repository4
    DiscountModule
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [TypeOrmModule],  // Export UserService and TypeOrmModule

})
export class CollectionModule {}
