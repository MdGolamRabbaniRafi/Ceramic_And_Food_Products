// import { Injectable, Inject } from '@nestjs/common';
// import { Redis } from 'ioredis';

// @Injectable()
// export class RedisService {
//   constructor(
//     @Inject('REDIS_CLIENT') private readonly client: Redis,
//   ) {}

//   // Blacklist a token with an expiry time
//   async blacklistToken(token: string, expiry: number): Promise<void> {
//     try {
//       expiry = Number(expiry);
//       await this.client.set(token, 'blacklisted', 'EX', expiry);
//     } catch (error) {
//       console.error('Error blacklisting token:', error);
//       throw error;
//     }
//   }

//   // Check if a token is blacklisted
//   async isBlacklisted(token: string): Promise<boolean> {
//     try {
//       const result = await this.client.get(token);
//       return result === 'blacklisted';
//     } catch (error) {
//       console.error('Error checking blacklist:', error);
//       throw error;
//     }
//   }

//   // Store OTP for a given email with an expiry time
//   async storeOtp(email: string, otp: string, expiry: number): Promise<void> {
//     try {
//       expiry = Number(expiry);
//       await this.client.set(email, otp, 'EX', expiry);
//     } catch (error) {
//       console.error('Error storing OTP:', error);
//       throw error;
//     }
//   }

//   // Retrieve OTP for a given email
//   async getOtp(email: string): Promise<string | null> {
//     try {
//       return await this.client.get(email);
//     } catch (error) {
//       console.error('Error retrieving OTP:', error);
//       throw error;
//     }
//   }

//   // Delete OTP for a given email
//   async deleteOtp(email: string): Promise<void> {
//     try {
//       await this.client.del(email);
//     } catch (error) {
//       console.error('Error deleting OTP:', error);
//       throw error;
//     }
//   }

//   // Store user details and OTP for a given email with an expiry time
//   async storeUserDetails(email: string, userDetails: any, otp: string, expiry: number): Promise<any> {
//     try {
//       const dataToStore = {
//         ...userDetails,
//         otp: otp,
//       };
//       const dataString = JSON.stringify(dataToStore);
//       await this.client.set(email, dataString, 'EX', expiry); 
//       return { message: 'User details and OTP stored' };
//     } catch (error) {
//       console.error('Error storing user details and OTP:', error);
//       throw error;
//     }
//   }

//   // Retrieve user details for a given email
//   async getUserDetails(email: string): Promise<any> {
//     try {
//       const userDetailsString = await this.client.get(email);
//       return JSON.parse(userDetailsString); 
//     } catch (error) {
//       console.error('Error retrieving user details:', error);
//       throw error;
//     }
//   }

//   // Set a key-value pair with an expiry time
//   async setActiveUser(socketId: string, userId: string, expiry?: number): Promise<void> {
//     try {
//       const key = `activeUser:${socketId}`; // Add prefix for consistency
//       if (expiry) {
//         await this.client.set(key, userId, 'EX', expiry);
//       } else {
//         await this.client.set(key, userId);
//       }
//     } catch (error) {
//       console.error('Error setting active user:', error);
//       throw error;
//     }
//   }
  

//   // Get a value by key
//   async getActiveUser(key: string): Promise<string | null> {
//     try {
//       return await this.client.get(key);
//     } catch (error) {
//       console.error('Error getting key:', error);
//       throw error;
//     }
//   }

//   // Delete a key
//   async delActiveUser(key: string): Promise<number> {
//     try {
//       console.log("key",key)
//       const res= await this.client.del(key);
//       console.log("res:",res)

//       return res;
//     } catch (error) {
//       console.error('Error deleting key:', error);
//       throw error;
//     }
//   }

//   // Get all keys matching a pattern
//   async keysActiveUser(pattern: string): Promise<string[]> {
//     try {
//       return await this.client.keys(pattern);
//     } catch (error) {
//       console.error('Error getting keys:', error);
//       throw error;
//     }
//   }
//   async getAllActiveUsers(): Promise<{ [key: string]: string }> {
//     try {
//       const pattern = 'activeUser:*'; // Same prefix as in setActiveUser
//       const keys = await this.client.keys(pattern); // Get all keys matching the pattern
  
//       const activeUsers: { [key: string]: string } = {};
  
//       for (const key of keys) {
//         const userId = await this.client.get(key);
//         if (userId) {
//           activeUsers[key.replace('activeUser:', '')] = userId; // Remove prefix when returning to clients
//         }
//       }
  
//       return activeUsers;
//     } catch (error) {
//       console.error('Error getting all active users:', error);
//       throw error;
//     }
//   }
  
// }
