// // src/chat/chat.service.ts

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// //import { Message } from './message.entity';
// import { UserEntity } from 'src/User/User.entity';
// import * as fs from 'fs';
// import * as path from 'path'; 

// @Injectable()
// export class ChatService {
//   constructor(
//     @InjectRepository(Message)
//     private messageRepository: Repository<Message>,
//     @InjectRepository(UserEntity)
//     private userRepository: Repository<UserEntity>,
//   ) {}

//   // Save a new message to the database
//   async saveMessage(message: any): Promise<Message> {
//     // console.log("message:", message);
  
//     // Fetch the sender and receiver from the database
//     const sender = await this.userRepository.findOne({ where: { Id: parseInt(message.senderId.toString(), 10) } });
//     const receiver = await this.userRepository.findOne({ where: { Id: parseInt(message.receiverId.toString(), 10) } });
  
//     if (!sender || !receiver) {
//       throw new NotFoundException('Sender or receiver not found');
//     }
  
//     let filePath = null;
  
//     // Check if a file is included in the message
//     if (message.filePath) {
//       // Assuming `message.file` contains the file path or URL
//       filePath = message.filePath; 
//     }
  
//     // Extract the 'text' and 'seen' fields from the message object
//     const { text, seen } = message;
  
//     // Create a new message object, including the file path if present
//     const newMessage = this.messageRepository.create({
//       sender,
//       receiver,
//       text,
//       seen,
//       filePath, // Add filePath to the message entity
//     });
  
//     // Save and return the new message
//     return this.messageRepository.save(newMessage);
//   }
  
//   async saveFile(file: any): Promise<string> {
//     const uploadDir = path.join(__dirname, '..', 'uploads'); // Define your upload directory
//     const fileName = `${Date.now()}-${file.originalname}`;
//     const filePath = path.join(uploadDir, fileName);
  
//     // Ensure that the upload directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
  
//     // Save the file to the disk (or cloud storage)
//     await fs.promises.writeFile(filePath, file.buffer);
  
//     return filePath;  // Return the file path for saving in the database
//   }

//   // Get all messages between two users
//   async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
//     const messages = await this.messageRepository.find({
//       where: [
//         { sender: { Id: user1Id }, receiver: { Id: user2Id } },
//         { sender: { Id: user2Id }, receiver: { Id: user1Id } },
//       ],
//       relations: ['sender', 'receiver'],
//       order: { createdAt: 'ASC' },
//     });
//     return messages;
//   }
//   async markMessageAsSeen(messageId: number): Promise<Message> {
//     const message = await this.messageRepository.findOne({ where: { id: messageId } });
  
//     if (!message) {
//       throw new Error('Message not found');
//     }
  
//     message.seen = true;
//     return await this.messageRepository.save(message);
//   }
//   async getUnseenMessages(userId: number,senderId:number): Promise<Message[]> {
//     return this.messageRepository.find({
//       where: { receiver: { Id: userId },sender:{Id:senderId}, seen: false },
//       relations: ['sender', 'receiver'],
//     });
//   }
//   async getLastSeenMessages(userId: number, senderId: number): Promise<Message | null> {
//     // Find the last message where the sender is senderId and receiver is userId, and message is seen by userId
//     const messages = await this.messageRepository.find({
//       where: {
//         sender: { Id: senderId },
//         receiver: { Id: userId },
//         seen: true,
//       },
//       relations: ['sender', 'receiver'],
//       order: { createdAt: 'DESC' },
//       take: 1,
//     });
  
//     // Return the most recent seen message or null if no such message exists
//     return messages.length > 0 ? messages[0] : null;
//   }
  
//   async getUnseenMessagesCountForAllUsers(receiverId: number): Promise<Record<number, number>> {
//     const results = await this.messageRepository
//       .createQueryBuilder('message')
//       .select('message.senderId', 'senderId')
//       .addSelect('COUNT(message.id)', 'unseenCount')
//       .where('message.receiverId = :receiverId AND message.seen = false', { receiverId })
//       .groupBy('message.senderId')
//       .getRawMany();

//     // Transform results into an object with senderId as key and unseenCount as value
//     const unseenMessageCounts: Record<number, number> = {};
//     results.forEach(result => {
//       const senderId = parseInt(result.senderId, 10);
//       const unseenCount = parseInt(result.unseenCount, 10);
//       unseenMessageCounts[senderId] = unseenCount;
//     });

//     return unseenMessageCounts;
//   }
//   async getLastMessagesForUser(userId: number): Promise<Message[]> {
//     const subquery = this.messageRepository
//       .createQueryBuilder("message")
//       .select("DISTINCT ON (LEAST(message.senderId, message.receiverId), GREATEST(message.senderId, message.receiverId)) message.id")
//       .where("message.senderId = :userId OR message.receiverId = :userId", { userId })
//       .orderBy("LEAST(message.senderId, message.receiverId), GREATEST(message.senderId, message.receiverId), message.createdAt", "DESC");
  
//     const query = this.messageRepository
//       .createQueryBuilder("message")
//       .where(`message.id IN (${subquery.getQuery()})`)
//       .leftJoinAndSelect("message.sender", "sender") // Assuming 'sender' is the relation to the User entity
//       .leftJoinAndSelect("message.receiver", "receiver") // Assuming 'receiver' is the relation to the User entity
//       .setParameters(subquery.getParameters()) // Set the parameters for the subquery
//       .orderBy("message.createdAt", "DESC"); // Order the messages by creation date
  
//     return await query.getMany();
//   }
  
  
// }
