import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './Category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) { }
  getHello(): string {
    return 'Hello Order!';
  }
  async findById(id: number): Promise<CategoryEntity | {message:string}> {
    let categoryEntity = await this.categoryRepo.findOne({ where: { Id: id } });
    if (categoryEntity != null) {
      return categoryEntity;
    }
    return {message:"Not found"};
  }
  async findAll(): Promise<any[]> {
    let categoryEntities = await this.categoryRepo.find();
    if (categoryEntities.length > 0) {
      return categoryEntities;
    }
    return [];
  }


  async addCategory(categoryEntity: CategoryEntity): Promise<CategoryEntity|{message:string}> {
    let Category = await this.categoryRepo.save(categoryEntity);
    if (Category != null) {
      return Category;
    }
    return {message:"Category not added"};
  }
  async editCategory(id: number, categoryData: Partial<CategoryEntity>): Promise<{message:string}> {
    const existingCategory = await this.categoryRepo.findOne({ where: { Id: id } });
  
    if (!existingCategory) {
      return {message:"Category not found"}; // Category not found
    }
  
    await this.categoryRepo.update(id, categoryData);
      return {message:"Category updated successfully"}; // Category not found
  }
  async deleteCategory(id: number): Promise<{message:string}> {
    const existingCategory = await this.categoryRepo.findOne({ where: { Id: id } });
  
    if (!existingCategory) {
      return {message:"Category not found"}; // Category not found
    }
  
    await this.categoryRepo.delete(id);
      return {message:"Category deleted successfully"}; // Category not found
  }
  

}