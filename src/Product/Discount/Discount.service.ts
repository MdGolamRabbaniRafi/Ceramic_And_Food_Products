import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { DiscountEntity } from './Discount.entity';
import { Cron } from '@nestjs/schedule';
import { ProductService } from '../Product.service';
import { CollectionEntity } from 'src/Collection/Collection.entity';

@Injectable()
export class DiscountService {
  private readonly logger = new Logger(DiscountService.name);

  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepo: Repository<DiscountEntity>,
    private readonly productService: ProductService,
    @InjectRepository(CollectionEntity)
    private collectionRepo: Repository<CollectionEntity>,
  ) {}

  async getAllDiscounts(): Promise<DiscountEntity[]> {
    return await this.discountRepo.find();
  }

  async getDiscountById(id: number): Promise<DiscountEntity | null> {
    const discount = await this.discountRepo.findOne({ where: { id: id } });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return discount;
  }
  async createDiscount(discountData: Partial<DiscountEntity>, productId: number): Promise<DiscountEntity | boolean> {
    try {
      // Fetch the product by the given productId
      const product = await this.productService.SearchByIDWithoutDiscount(productId);
      console.log("product:", product);
  
      if (!product) {
        throw new InternalServerErrorException('Product not found');
      }
  
      // If the product already has a discount, remove it
      if (product.discount) {
        let discount = product.discount;
        product.discount = null;
    
        console.log("before updating product");
          
        // Update the product to remove the discount reference
        await this.productService.editProduct(product.Id, product);
      }
  
      // Create the new discount
      const discount = new DiscountEntity();
      discount.discountPercentage = discountData.discountPercentage;
      discount.startDate = discountData.startDate;
      discount.endDate = discountData.endDate;
  
      // Assign the product to the discount
      discount.products = [product]; // Wrap the product in an array
  
      // Save the new discount and assign it to the product
      const newDiscount = await this.discountRepo.save(discount);
  
      // Update the product with the new discount
      product.discount = newDiscount;
      await this.productService.editProduct(product.Id, product);
  
      // Break the circular reference before returning the response
      const responseDiscount = { ...newDiscount };
      delete responseDiscount.products; // Remove products from the discount to avoid circular structure
  
      return responseDiscount;
    } catch (error) {
      console.error('Error creating discount:', error);
      throw new InternalServerErrorException('Error creating discount');
    }
  }
  
  
  
  
  

  async editDiscount(id: number, discountData: Partial<DiscountEntity>): Promise<DiscountEntity | boolean> {
    const discount = await this.discountRepo.findOne({ where: { id: id } });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    try {
      await this.discountRepo.update(id, discountData);
      return await this.discountRepo.findOne({ where: { id: id } });
    } catch (error) {
      console.error("Error updating discount:", error.message);
      throw new InternalServerErrorException('Error updating discount');
    }
  }

  async deleteDiscount(id: number): Promise<boolean> {
    const discount = await this.discountRepo.findOne({ where: { id: id } });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    try {
      await this.discountRepo.remove(discount);
      return true;
    } catch (error) {
      console.error("Error deleting discount:", error.message);
      throw new InternalServerErrorException('Error deleting discount');
    }
  }

  async applyDiscountToCollection(
    collectionId: number,
    discountData: Partial<DiscountEntity>
  ): Promise<{ success: boolean; message: string }> {
    const collection = await this.collectionRepo.findOne({
      where: { Id: collectionId },
      relations: ['products', 'products.discount'],
    });
  
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${collectionId} not found`);
    }
  
    // Check for existing discount with the same unique fields
    const existingDiscount = await this.discountRepo.findOne({
      where: {
        discountPercentage: discountData.discountPercentage,
        endDate: discountData.endDate,
      },
    });
  
    let newDiscount: DiscountEntity;
  
    if (existingDiscount) {
      console.log("Using existing discount:", existingDiscount);
      newDiscount = existingDiscount; // Reuse the existing discount
    } else {
      // Create a new discount if it doesn't exist
      newDiscount = this.discountRepo.create(discountData);
    }
  
    // Apply the new discount to each product in the collection
    for (const product of collection.products) {
      if (product.discount) {
        const discountId = product.discount.id;
        console.log(`Product ID ${product.Id} has an existing discount ${discountId}. Removing it...`);
        
        // Remove the discount reference from the product
        product.discount = null;
        await this.productService.editProduct(product.Id,product); // Save product after removing old discount
        
        // Now delete the existing discount
        // await this.discountRepo.delete(discountId);
        // console.log("deleted:", discountId);
      }
    }
  
    // Save the new discount if it's a new one
    if (!existingDiscount) {
      console.log("added:", newDiscount);
      await this.discountRepo.save(newDiscount);
    }
  
    // Link the new discount to each product
    for (const product of collection.products) {
      product.discount = newDiscount;
      console.log("product:", product);
      await this.productService.editProduct(product.Id,product);
    }
  
    return { success: true, message: `Discount applied to collection and its products.` };
  }
  @Cron('0 * * * *') // This will run the task every hour
  async deleteExpiredDiscounts(): Promise<void> {
    const now = new Date();
    try {
      const expiredDiscounts = await this.discountRepo.find({
        where: { endDate: LessThan(now) },
      });

      if (expiredDiscounts.length > 0) {
        await this.discountRepo.remove(expiredDiscounts);
        this.logger.log(`${expiredDiscounts.length} expired discounts deleted.`);
      }
    } catch (error) {
      this.logger.error('Error deleting expired discounts:', error.message);
    }
  }
}
