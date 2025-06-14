// import { UserEntity } from 'src/User/User.entity';
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

// @Entity()
// export class Message {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => UserEntity, user => user.sentMessages)
//   sender: UserEntity;

//   @ManyToOne(() => UserEntity, user => user.receivedMessages)
//   receiver: UserEntity;

//   @Column()
//   text: string;

//   @Column({ nullable: true })  // Make this optional for messages that don't include files
//   filePath: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @Column({ default: false }) 
//   seen: boolean;
// }
