import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { OrderEntity } from 'src/Order/Order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [GraphService],
  controllers: [GraphController],
})
export class GraphModule {}
