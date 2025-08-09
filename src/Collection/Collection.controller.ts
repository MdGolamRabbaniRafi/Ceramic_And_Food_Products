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
import { CollectionEntity } from './Collection.entity';
import { CollectionService } from './Collection.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collection')
@Controller('Collection')
export class CollectionController {
  constructor(private readonly CollectionService: CollectionService) {}

  @Get()
  getHello(): string {
    return this.CollectionService.getHello();
  }
  @Get('/search/:id')
  async SearchByID(@Param('id', ParseIntPipe) Id: number): Promise<any> {
    return await this.CollectionService.findById(Id);
  }
  @Get('/search')
  async Search(): Promise<any> {
    return await this.CollectionService.findAll();
  }

  @Post('/addCollection')
  async addCollection(
    @Body() body: { collectionData: CollectionEntity; productIds: number[] },
  ): Promise<{
    success: boolean;
    message: string;
    missingProductIds?: number[];
  }> {
    const { collectionData, productIds } = body;
    return await this.CollectionService.addCollection(
      collectionData,
      productIds,
    );
  }

  @Put('/edit/:id')
  async editCollection(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: { collectionData: Partial<CollectionEntity>; productIds: number[] },
  ): Promise<{
    success: boolean;
    message: string;
    missingProductIds?: number[];
  }> {
    const { collectionData, productIds } = body;
    return await this.CollectionService.editCollection(
      id,
      collectionData,
      productIds,
    );
  }

  @Delete('/delete/:id')
  async deleteCollection(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; message: string }> {
    return await this.CollectionService.deleteCollection(id);
  }
}
