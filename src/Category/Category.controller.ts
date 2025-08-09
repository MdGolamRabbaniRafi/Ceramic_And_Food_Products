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
import { CategoryEntity } from './Category.entity';
import { CategoryService } from './Category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getHello(): string {
    return this.categoryService.getHello();
  }
  @Get('/search/:id')
  async SearchByID(@Param('id', ParseIntPipe) Id: number): Promise<any> {
    return await this.categoryService.findById(Id);
  }
  @Get('/search')
  async Search(): Promise<any> {
    return await this.categoryService.findAll();
  }

  @Post('/add')
  async addCategory(
    @Body() CategoryData: CategoryEntity,
  ): Promise<CategoryEntity | { message: string }> {
    return await this.categoryService.addCategory(CategoryData); //Category/addCategory
  }
  @Put('/edit/:id')
  async editCategory(
    @Param('id', ParseIntPipe) Id: number,
    @Body() categoryData: Partial<CategoryEntity>,
  ): Promise<{ message: string }> {
    return await this.categoryService.editCategory(Id, categoryData);
  }
  @Delete('/delete/:id')
  async deleteCategory(
    @Param('id', ParseIntPipe) Id: number,
  ): Promise<{ message: string }> {
    return await this.categoryService.deleteCategory(Id);
  }
}
