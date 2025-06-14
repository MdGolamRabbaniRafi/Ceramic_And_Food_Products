import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from "typeorm";
import { UserEntity } from "src/User/User.entity";

@Entity("Token")
export class TokenEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'token', type: "varchar", unique: true })
  token: string;

  @Column({ name: 'Expire_Time', type: "timestamp" })
  @Index()  // Indexing for better query performance
  Expire_Time: Date;

//   @ManyToOne(() => UserEntity, user => user.token, { onDelete: 'CASCADE' })
//   user: UserEntity;
}
