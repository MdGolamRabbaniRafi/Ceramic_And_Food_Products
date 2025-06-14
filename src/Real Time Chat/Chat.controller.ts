// // src/chat/chat.controller.ts

// import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
// import { ChatService } from './chat.service';
// import { Message } from './message.entity';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname, resolve } from 'path';

// @Controller('chat')
// export class ChatController {
//   constructor(private chatService: ChatService) {}

//   // Get messages between two users
//   @Get('messages-between/:user1/:user2')
//   async getMessagesBetweenUsers(
//     @Param('user1', ParseIntPipe) user1: number,
//     @Param('user2', ParseIntPipe) user2: number,
//   ): Promise<Message[]> {
//     return this.chatService.getMessagesBetweenUsers(user1, user2);
//   }

//   // Get unseen messages between a user and a sender
//   @Get('unseen-messages/:userId/:senderId')
//   async getUnseenMessages(
//     @Param('userId', ParseIntPipe) userId: number,
//     @Param('senderId', ParseIntPipe) senderId: number,
//   ): Promise<Message[]> {
//     return this.chatService.getUnseenMessages(userId, senderId);
//   }
//   @Get('last-seen-message/:userId/:senderId')
//   async getLastSeenMessages(
//     @Param('userId', ParseIntPipe) userId: number,
//     @Param('senderId', ParseIntPipe) senderId: number,
//   ): Promise<Message> {
//     return this.chatService.getLastSeenMessages(userId, senderId);
//   }
//   @Get('unseen-messages-count/:receiverId')
//   async getUnseenMessagesCount(
//     @Param('receiverId', ParseIntPipe) receiverId: number,
//   ): Promise<Record<number, number>> {
//     return this.chatService.getUnseenMessagesCountForAllUsers(receiverId);
//   }
  
//   @Get('last-messages/:userId')
//   async getLastMessagesForUser(
//     @Param('userId', ParseIntPipe) userId: number,
//   ): Promise<Message[]> {
//     return this.chatService.getLastMessagesForUser(userId);
//   }
//   @Post('/send-message')
//   @UseInterceptors(
//     FilesInterceptor('files', 10, {
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           let urlPath = process.env.Message_Image_Destination;

//           // Handle CPanel file path conversion
//           if (urlPath.startsWith('https://farseit.com')) {
//             const localPath = urlPath.replace('https://farseit.com', '/home/farseit1/public_html');
//             cb(null, localPath);
//           } else {
//             cb(null, urlPath);
//           }
//         },
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//           const extension = extname(file.originalname);
//           const filename = `${uniqueSuffix}${extension}`;
//           cb(null, filename);
//         },
//       }),
//     }),
//   )
//   async addMessage(@Body() message: any, @UploadedFiles() files?: Express.Multer.File[]) {
//     try {
//       let filePath = null;
//       console.log("files:",files)

//       // Handle multiple file uploads and create comma-separated URLs
//       if (files && files.length > 0) {
//         const imageBaseUrl = process.env.Message_Image_Destination;
//         filePath = files.map(file => `${imageBaseUrl}/${file.filename}`).join(',');
//       }

//       // Save message in the database with file URLs
//       const savedMessage = await this.chatService.saveMessage({
//         ...message,
//         filePath, // Store multiple file URLs as a comma-separated string
//       });
//       console.log("savedMessage:",savedMessage)

//       // Return saved message details, including file URLs and messageId
//       return {
//         message: savedMessage,
//         filePath, // Comma-separated URLs
//       };
//     } catch (error) {
//       console.error('Error saving message:', error); // Log the full error
//       throw new Error('Error saving message');
//     }
//   }

  
  
// }
