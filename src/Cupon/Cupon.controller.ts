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
import { CuponService } from './Cupon.service';
import { CuponEntity } from './Cupon.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cupon')
@Controller('Cupon')
export class CuponController {
  constructor(private readonly cuponService: CuponService) {}

  @Get()
  async getAllCupons(): Promise<CuponEntity[]> {
    return await this.cuponService.getAllCupons();
  }

  @Get('/:id')
  async getCuponById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CuponEntity | null> {
    return await this.cuponService.getCuponById(id);
  }

  // @Post('/add')
  // async createDiscount(@Body() CuponData: Partial<CuponEntity>, @Body('orderId') orderId: number): Promise<CuponEntity | boolean> {
  //   return await this.cuponService.createDiscount(CuponData, orderId);
  // }

  @Post('/add')
  async createCupon(
    @Body() cuponData: Partial<CuponEntity>,
  ): Promise<CuponEntity> {
    return await this.cuponService.createCupon(cuponData);
  }

  @Put('/edit/:id')
  async editCupon(
    @Param('id', ParseIntPipe) id: number,
    @Body() cupontData: Partial<CuponEntity>,
  ): Promise<CuponEntity | boolean> {
    return await this.cuponService.editCupon(id, cupontData);
  }

  @Delete('/delete/:id')
  async deleteCupon(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.cuponService.deleteCupon(id);
  }
  //     @Post('/apply-discount/:collectionId')
  //   async applyDiscount(
  //     @Param('collectionId', ParseIntPipe) collectionId: number,
  //     @Body() discountData: Partial<CuponEntity>
  //   ): Promise<{ success: boolean; message: string }> {
  //     return await this.cuponService.applyDiscountToCollection(collectionId, discountData);
  //   }
}
