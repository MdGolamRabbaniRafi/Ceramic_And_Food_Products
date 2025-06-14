// import { OrderHistoryMapperEntity } from "src/Mapper/Order History Mapper/OHM.entity";
import { OrderEntity } from "src/Order/Order.entity";
import { ProductEntity } from "src/Product/Product.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm";

@Entity("Payment")
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'Pay_amount', type: "int" })
    Pay_amount: number;
    @Column({ name: 'status', type: "varchar", length: 150 })
    status: string;
    @Column({ name: 'date', type: "timestamp" })
    date: Date;
    @Column({ name: 'Method', type: "varchar", length: 150 })
    Method: string;

    @OneToOne(() => OrderEntity, (order) => order.payment)
    @JoinColumn() // Necessary for one-to-one relationships
    order: OrderEntity;
    // @OneToMany(() => OrderHistoryMapperEntity, orderHistoryMapper => orderHistoryMapper.payment)
    // orderHistoryMapper: OrderHistoryMapperEntity[];

}
