import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './Token.entity';
import { TokenService } from './token.service';
import { CleanupService } from './cleanup.service';
import { AuthModule } from '../Auth.module';

@Module({
    imports: [
      forwardRef(() => AuthModule), 
      TypeOrmModule.forFeature([TokenEntity])
    ],
    providers: [TokenService,CleanupService],
    exports: [TokenService],
  })
  export class TokenModule {}
  