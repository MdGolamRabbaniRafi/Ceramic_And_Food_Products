import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from 'src/User/User.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { CuponEntity } from 'src/Cupon/Cupon.entity';
import { OrderProductMapperEntity } from 'src/Mapper/Order Product Mapper/OrderProductMapper.entity';
import { PaymentEntity } from 'src/Payment/Payment.entity';

@Entity('Order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'decimal' })
  totalAmount: number;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  district: string;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @Column({ type: 'varchar', nullable: true })
  receiverPhone: string;

  @Column({ type: 'bool', default: false })
  isActive: boolean;

  @Column({ type: 'decimal' })
  originalPrice: number;

  @Column({ type: 'decimal', nullable: true })
  discountedPrice: number;

  @ManyToOne(() => UserEntity, (user) => user.order)
  user: UserEntity;

  @Column({
    type: 'timestamp',
    default: () => "NOW() + INTERVAL '10 minutes'",
  })
  expireTime: Date;

  @ManyToMany(() => ProductEntity)
  @JoinTable({
    name: 'Order_Product',
    joinColumn: { name: 'orderId', referencedColumnName: 'Id' },
    inverseJoinColumn: { name: 'productId', referencedColumnName: 'Id' },
  })
  products: ProductEntity[];
  @OneToMany(() => OrderProductMapperEntity, (mapper) => mapper.order, {
    nullable: true,
    cascade: true,
  })
  orderProductMappers: OrderProductMapperEntity[];
  @ManyToOne(() => CuponEntity, (cupon) => cupon.orders, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  cupon: CuponEntity;

  @OneToOne(() => PaymentEntity, (payment) => payment.order)
  payment: PaymentEntity;
}
