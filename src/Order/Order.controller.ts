import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrderEntity } from './Order.entity';
import { OrderService } from './Order.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }
  @Post('/add')
  async addOrder(
    @Body() OrderData: any,
  ): Promise<OrderEntity | { message: String }> {
    return await this.orderService.addOrder(OrderData);
  }
  @Get('/search')
  async searchOrder(): Promise<any> {
    return await this.orderService.searchOrder();
  }
  @Get('/search/:id')
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.orderService.getOrderById(id);
  }

  @Put('/edit/:id')
  async editOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedOrderData: any,
  ): Promise<string> {
    return await this.orderService.editOrder(id, updatedOrderData);
  }
  @Put('/changeStatus/:id')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<OrderEntity | { message: string }> {
    return await this.orderService.changeStatus(id, status);
  }

  @Delete('/delete/:id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.orderService.deleteOrder(id);
  }

  @Get('/user/:userId')
  async getOrdersByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrderEntity[]> {
    return await this.orderService.getOrdersByUserId(userId);
  }

  @Get('/inactiveOrder/:userId')
  async getInactiveOrdersByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrderEntity[]> {
    return await this.orderService.getInactiveOrdersByUserId(userId);
  }
  @Delete('/inactiveOrder/:userId')
  async deleteInactiveOrdersByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<string> {
    return await this.orderService.deleteInactiveOrdersByUserId(userId);
  }
}
