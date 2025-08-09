import { ApiTags } from '@nestjs/swagger';
import { OrderEntity } from 'src/Order/Order.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@ApiTags('Banner')
@Entity('OrderProductMapper')
export class OrderProductMapperEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => OrderEntity, (order) => order.products)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;

  @Column({ type: 'json' })
  json_attribute: JSON;
}
