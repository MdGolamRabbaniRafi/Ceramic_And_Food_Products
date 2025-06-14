import { OrderEntity } from 'src/Order/Order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('cupon')
export class CuponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'name',type:'varchar'})
  name: string;

  @Column({name:'amount',type:'decimal'})
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  startDate: Date;
  
  @Column({ type: 'timestamp' })
  endDate: Date;

  @OneToMany(() => OrderEntity, (order) => order.cupon)
  orders: OrderEntity[];
}