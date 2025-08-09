import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import { CartService } from './Cart.service';
import { CartEntity } from './Cart.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Body() cartData: any,
  ): Promise<{ success: boolean; message: string; cart: CartEntity }> {
    return await this.cartService.addToCart(cartData);
  }

  @Get('user/:userId')
  async getCartByUser(@Param('userId') userId: number): Promise<CartEntity[]> {
    return await this.cartService.findByUserId(userId);
  }

  @Delete('user/:userId')
  async deleteCartByUser(
    @Param('userId') userId: number,
  ): Promise<{ success: boolean }> {
    const result = await this.cartService.deleteByUserId(userId);
    return { success: result };
  }
  @Delete('user/:userId/product/:productId')
  async removeProductFromCart(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ): Promise<{ success: boolean; message: string }> {
    return await this.cartService.removeProductFromCart(userId, productId);
  }
  @Put('user/:userId/product/:productId')
  async reduceToCart(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ): Promise<{ success: boolean; message: string; cart: CartEntity }> {
    return await this.cartService.reduceToCart({ userId, productId });
  }
  @Get('ProductCount/user/:userId')
  async ProductCount(@Param('userId') userId: number): Promise<Number> {
    const result = await this.cartService.ProductCount(userId);
    return result;
  }
}
