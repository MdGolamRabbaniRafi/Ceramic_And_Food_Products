// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ChatService } from './chat.service';
// import { RedisService } from 'src/auth/Redis/redis.service';
// import { UserService } from 'src/User/User.service';
// import { use } from 'passport';
// import { NotFoundError } from 'rxjs';
// import { InternalServerErrorException } from '@nestjs/common';
// import { Message } from './message.entity';

// @WebSocketGateway({ cors: true })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   constructor(
//     private chatService: ChatService,
//     private redisService: RedisService,
//     private userService: UserService
//   ) { }

//   // When a client connects
//   async handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   // When a client disconnects
//   // When a client disconnects
//   async handleDisconnect(client: Socket) {
//     try {
//       const userId = await this.redisService.getActiveUser(`activeUser:${client.id}`);
//       console.log(`Client disconnected: ${client.id}`);

//       if (userId) {
//         // Ensure you're deleting the key with the correct prefix
//         await this.redisService.delActiveUser(`activeUser:${client.id}`);
//         this.broadcastActiveUsers();
//         console.log(`User ${userId} disconnected and removed from active users`);
//       }
//     } catch (error) {
//       console.error(`Error handling disconnection: ${error.message}`);
//       throw new InternalServerErrorException('Error during disconnect');
//     }
//   }

//   @SubscribeMessage('join')
//   async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
//     const userIdInt = parseInt(userId, 10);

//     try {
//       const response = await this.userService.SearchByID(userIdInt);

//       if (response) {
//         console.log(`User ${userId} joined with socket ID: ${client.id}`);

//         // Check if the user is already connected with a different socket ID
//         const activeUsers = await this.redisService.getAllActiveUsers();

//         // Check for duplicate users and remove the old socket ID if necessary
//         for (const [socketId, activeUserId] of Object.entries(activeUsers)) {
//           if (activeUserId === userId) {
//             console.log(`User ${userId} is already connected with socket ID: ${socketId}. Removing old socket.`);

//             const redisKey = `activeUser:${socketId}`; // Add the correct prefix when deleting
//             await this.redisService.delActiveUser(redisKey);
//             this.server.sockets.sockets.get(socketId)?.disconnect(); // Optionally disconnect the old socket
//           }
//         }


//         // Join the room for the user and store the new active user
//         client.join(userId);
//         await this.redisService.setActiveUser(client.id, userId);
//         this.broadcastActiveUsers();
//       } else {
//         console.error(`User ${userId} not found in the database. Disconnecting socket.`);
//         client.emit('error', 'User not found');
//         client.disconnect(); // Disconnect the socket
//       }
//     } catch (error) {
//       console.error(`Error during 'join' event: ${error.message}`);
//       client.emit('error', 'Server error');
//     }
//   }




//   // When a message is sent
//   @SubscribeMessage('message')
// async handleMessage(
//   @ConnectedSocket() client: Socket,
//   @MessageBody() message: any,
// ) {
//   let savedMessage = message; // Initialize with the message directly

//   // If no file is present, save the message
//   if (!message.filePath) {
//     savedMessage = await this.chatService.saveMessage(message);
//   }

//   // Emit to receiver
//   this.server.to(message.receiverId.toString()).emit('message', savedMessage);

//   // Emit to sender for confirmation
//   client.emit('message', savedMessage);

//   console.log('Message emitted:', savedMessage);
// }


//   // Broadcast active users to all connected clients
//   // Broadcast active users to all connected clients with their status
//   // Broadcast active users with only Id, name, role, Image, and status
//   private async broadcastActiveUsers() {
//     try {
//       const allUsers = await this.userService.getAllUsers(); // Fetch all users from database
//       const activeUsers = await this.redisService.getAllActiveUsers(); // Fetch active users from Redis

//       // Map through users and include only necessary fields
//       const usersWithStatus = allUsers.map(user => {
//         const isActive = Object.values(activeUsers).includes(user.Id.toString());
//         return {
//           Id: user.Id,
//           name: user.name,
//           role: user.role,
//           Image: user.Image,
//           status: isActive ? 'active' : 'inactive',
//         };
//       });

//       // Emit the filtered users data
//       this.server.emit('activeUsers', usersWithStatus);
//       // console.log(`Active users updated: ${JSON.stringify(usersWithStatus)}`);
//     } catch (error) {
//       console.error(`Error broadcasting active users: ${error.message}`);
//     }
//   }


//   @SubscribeMessage('messageSeen')
//   async handleMessageSeen(
//     @MessageBody() messageId: number,
//     @ConnectedSocket() client: Socket,
//   ) {
//     const message = await this.chatService.markMessageAsSeen(messageId);
//     // console.log("seenMessage:",message)

//     if (message && message.sender && message.receiver) {
//       this.server.to(message.sender.Id.toString()).emit('messageSeen', message);
//       this.server.to(message.receiver.Id.toString()).emit('messageSeen', message);
//     } else {
//       console.error("Message, sender, or receiver is undefined:", message);
//     }


//   }
// }
