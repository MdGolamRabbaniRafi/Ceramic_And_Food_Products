import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { ProductEntity } from '../Product.entity';

@Entity('discount')
export class DiscountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  discountPercentage: number;

  @CreateDateColumn({ type: 'timestamp' })
  startDate: Date;
  
  @Column({ type: 'timestamp' })
  endDate: Date;

  @OneToMany(() => ProductEntity, (product) => product.discount)
  products: ProductEntity[];
}