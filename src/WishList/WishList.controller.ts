import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { WishListService } from './WishList.service';
import { WishListEntity } from './WishList.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Wishlist')
@Controller('WishList')
export class WishListController {
  constructor(private readonly wishlistService: WishListService) {}

  @Post('/add')
  wishListProduct(
    @Body() myobj: WishListEntity,
  ): Promise<WishListEntity | { message: string } | boolean> {
    const product = myobj.product.Id;
    const user = myobj.user.Id;

    return this.wishlistService.wishListProduct({ product, user });
  }

  @Get('show_wishlist/:userId')
  showWishListProduct(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<WishListEntity[]> {
    return this.wishlistService.showWishListProduct(userId);
  }
  @Delete('/delete/:id')
  deleteWishListProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean | { message: string }> {
    return this.wishlistService.deleteWishListProduct(id);
  }
}
