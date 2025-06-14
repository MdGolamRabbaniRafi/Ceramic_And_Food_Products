import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "src/User/User.entity";
import { ProductEntity } from "src/Product/Product.entity";

@Entity("Cart")
export class CartEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'session_id', type: "int" })
  session_id: number;

  @Column({ name: 'date', type: "timestamp" })
  date: Date;

  @ManyToOne(() => UserEntity, (user) => user.cart)
  user: UserEntity;

  @Column("json", { nullable: true })  // Store products as JSON
  products: { product: ProductEntity; quantity: number }[];
}
