import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from './Collection.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { DiscountEntity } from 'src/Product/Discount/Discount.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private CollectionRepo: Repository<CollectionEntity>,
    @InjectRepository(ProductEntity)
    private ProductRepo: Repository<ProductEntity>,
    @InjectRepository(DiscountEntity)
    private DiscountRepo: Repository<DiscountEntity>,

  ) { }
  getHello(): string {
    return 'Hello Order!';
  }
  async findAll(): Promise<CollectionEntity[]> {
    const collections = await this.CollectionRepo.find({ relations: ['products', 'products.discount'] });
    return collections;
  }

  async findById(id: number): Promise<CollectionEntity | null> {
    const collection = await this.CollectionRepo.findOne({ where: { Id: id }, relations: ['products', 'products.discount'] });
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
    return collection;
  }
 
  
  








  async addCollection(collectionData: Partial<CollectionEntity>, productIds: number[]): Promise<{ success: boolean, message: string, missingProductIds?: number[] }> {
    const products = await this.ProductRepo.findByIds(productIds);
    const foundProductIds = products.map(product => product.Id);
    const missingProductIds = productIds.filter(productId => !foundProductIds.includes(productId));

    if (missingProductIds.length > 0) {
      return {
        success: false,
        message: 'Some products do not exist in the database.',
        missingProductIds
      };
    }
    const newCollection = this.CollectionRepo.create({ ...collectionData, products });

    const savedCollection = await this.CollectionRepo.save(newCollection);

    return {
      success: !!savedCollection,
      message: !!savedCollection ? 'Collection saved successfully.' : 'Failed to save collection.'
    };
  }
  async editCollection(
    id: number,
    collectionData: Partial<CollectionEntity>,
    productIds: number[]
  ): Promise<{ success: boolean, message: string, missingProductIds?: number[] }> {
    const collection = await this.CollectionRepo.findOne({ where: { Id: id }, relations: ['products'] });
    if (!collection) {
      return {
        success: false,
        message: 'Collection not found.'
      };
    }

    // Fetch the product entities based on productIds
    const products = await this.ProductRepo.findByIds(productIds);
    const foundProductIds = products.map(product => product.Id);
    const missingProductIds = productIds.filter(productId => !foundProductIds.includes(productId));

    if (missingProductIds.length > 0) {
      return {
        success: false,
        message: 'Some products do not exist in the database.',
        missingProductIds
      };
    }

    // Update collection data
    collection.name = collectionData.name || collection.name;
    collection.products = products;  // Update products in collection

    const savedCollection = await this.CollectionRepo.save(collection);

    return {
      success: !!savedCollection,
      message: !!savedCollection ? 'Collection updated successfully.' : 'Failed to update collection.'
    };
  }
  async deleteCollection(id: number): Promise<{ success: boolean, message: string }> {
    const collection = await this.CollectionRepo.findOne({ where: { Id: id } });

    if (!collection) {
      return {
        success: false,
        message: 'Collection not found.',
      };
    }

    await this.CollectionRepo.remove(collection);

    return {
      success: true,
      message: 'Collection deleted successfully.',
    };
  }


}