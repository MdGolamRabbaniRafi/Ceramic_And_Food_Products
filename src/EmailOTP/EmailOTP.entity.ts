import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from 'src/User/User.entity';

@Entity('OTP')
export class OTPEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'otp', type: 'varchar' })
  otp: string;

  @Column({ name: 'Expire_Time', type: 'timestamp' })
  @Index() // Indexing for better query performance
  Expire_Time: Date;

  @Column({ name: 'Email', type: 'varchar' })
  email: string;
  @Column({ name: 'user', type: 'json', nullable: true })
  User: UserEntity;
  //   @ManyToOne(() => UserEntity, user => user.token, { onDelete: 'CASCADE' })
  //   user: UserEntity;
}
