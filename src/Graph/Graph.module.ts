import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphController } from './graph.controller';
import { OrderEntity } from 'src/Order/Order.entity';
import { GraphService } from './graph.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [GraphService],
  controllers: [GraphController],
})
export class GraphModule {}
