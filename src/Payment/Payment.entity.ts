// import { OrderHistoryMapperEntity } from "src/Mapper/Order History Mapper/OHM.entity";
import { OrderEntity } from 'src/Order/Order.entity';
import { UserEntity } from 'src/User/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'Pay_amount', type: 'int' })
  Pay_amount: number;

  @Column({ name: 'status', type: 'varchar', length: 150 })
  status: string;

  @Column({ name: 'image', type: 'varchar', length: 150 })
  image: string;

  @Column({ name: 'date', type: 'timestamp', default: new Date() })
  date: Date;

  @ManyToOne(() => UserEntity, (user) => user.payment)
  user: UserEntity;
  @Column()
  userId: number;

  @OneToOne(() => OrderEntity, (order) => order.payment)
  @JoinColumn() // Necessary for one-to-one relationships
  order: OrderEntity;
  @Column()
  orderId: number;
  // @OneToMany(() => OrderHistoryMapperEntity, orderHistoryMapper => orderHistoryMapper.payment)
  // orderHistoryMapper: OrderHistoryMapperEntity[];
}
