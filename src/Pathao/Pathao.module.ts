import { Module } from '@nestjs/common';
import { PathaoService } from './pathao.service';
import { PathaoController } from './pathao.controller';

@Module({
  controllers: [PathaoController],
  providers: [PathaoService],
})
export class PathaoModule {}
