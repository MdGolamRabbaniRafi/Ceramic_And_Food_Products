import { Controller, Post, Body } from '@nestjs/common';
import { PathaoService } from './pathao.service'; // Import PathaoService

@Controller('pathao')
export class PathaoController {
  constructor(private readonly pathaoService: PathaoService) {} // Inject service

  @Post('create-order')
  async createOrder(@Body() orderData: any) {
    console.log("📦 Received Order Data:", JSON.stringify(orderData));

    // Call the service method
    const response = await this.pathaoService.createOrder(orderData);
    
    return response;
  }
}
