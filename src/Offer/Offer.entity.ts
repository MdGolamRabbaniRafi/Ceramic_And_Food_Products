import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('offer')
export class OfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'Status', type: 'boolean', default: true })
  isActive: boolean;

  @Column()
  image: string; // Store the file path or URL

  @Column('json', { nullable: true })
  Details: object;
}
