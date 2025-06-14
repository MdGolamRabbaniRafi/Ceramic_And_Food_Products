import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { TokenEntity } from './Token.entity';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  @Interval(60000) // Runs every 60 seconds (1 minute)
  async deleteExpiredTokens() {
    const deleteResonse = await this.tokenRepository.delete({ Expire_Time: LessThan(new Date()) });
    console.log('Expired tokens removed:',deleteResonse.affected);
  }
}
