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
import { DiscountService } from './Discount.service';
import { DiscountEntity } from './Discount.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Discount')
@Controller('Discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  async getAllDiscounts(): Promise<DiscountEntity[]> {
    return await this.discountService.getAllDiscounts();
  }

  @Get('/:id')
  async getDiscountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DiscountEntity | null> {
    return await this.discountService.getDiscountById(id);
  }

  @Post('/add')
  async createDiscount(
    @Body() discountData: Partial<DiscountEntity>,
    @Body('productId') productId: number,
  ): Promise<DiscountEntity | boolean> {
    return await this.discountService.createDiscount(discountData, productId);
  }

  @Put('/edit/:id')
  async editDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body() discountData: Partial<DiscountEntity>,
  ): Promise<DiscountEntity | boolean> {
    return await this.discountService.editDiscount(id, discountData);
  }

  @Delete('/delete/:id')
  async deleteDiscount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return await this.discountService.deleteDiscount(id);
  }
  @Post('/apply-discount/:collectionId')
  async applyDiscount(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() discountData: Partial<DiscountEntity>,
  ): Promise<{ success: boolean; message: string }> {
    return await this.discountService.applyDiscountToCollection(
      collectionId,
      discountData,
    );
  }
}
