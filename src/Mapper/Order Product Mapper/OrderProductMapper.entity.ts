import { ApiTags } from '@nestjs/swagger';
import { OrderEntity } from 'src/Order/Order.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@ApiTags('Banner')
@Entity('OrderProductMapper')
export class OrderProductMapperEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderProductMappers, {
    onDelete: 'CASCADE', // ensures child rows are removed when parent order is deleted
  })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orders, {
    onDelete: 'CASCADE', // optional: cascade delete when product is removed
  })
  product: ProductEntity;

  @Column({ type: 'json' })
  json_attribute: JSON;
}
