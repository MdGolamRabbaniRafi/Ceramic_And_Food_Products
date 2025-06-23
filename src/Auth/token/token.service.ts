import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './Token.entity';
import { UserEntity } from 'src/User/User.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  // Store token after logout
  async saveToken(
    //user: UserEntity, 
    token: string, expireTime: Date): Promise<TokenEntity> {
    const newToken = this.tokenRepository.create({
      token,
      Expire_Time: expireTime,
      //user,
    });
    return await this.tokenRepository.save(newToken);
  }

  // Find a token by its value
  async findToken(token: string): Promise<TokenEntity | null> {
    return await this.tokenRepository.findOne({ where: { token }
        //, relations: ['user'] 
    });
  }

  // Delete a token manually
  async deleteToken(token: string): Promise<void> {
    await this.tokenRepository.delete({ token });
  }

  // Delete all tokens of a user (useful when logging in again)
//   async deleteTokensByUser(userId: number): Promise<void> {
//     await this.tokenRepository.createQueryBuilder()
//       .delete()
//       .from(TokenEntity)
//       .where("userId = :userId", { userId })
//       .execute();
//   }

  // Automatically delete expired tokens
  async deleteExpiredTokens(): Promise<void> {
    await this.tokenRepository.createQueryBuilder()
      .delete()
      .from(TokenEntity)
      .where("Expire_Time <= NOW()")
      .execute();
  }
}
