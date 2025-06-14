import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { CuponEntity } from './Cupon.entity';
import { OrderService } from 'src/Order/Order.service';

@Injectable()
export class CuponService {
  private readonly logger = new Logger(CuponService.name);

  constructor(
    @InjectRepository(CuponEntity)
    private cuponRepo: Repository<CuponEntity>,
    private readonly orderService: OrderService,
  ) {}

  async getAllCupons(): Promise<CuponEntity[]> {
    return await this.cuponRepo.find();
  }

  async getCuponById(id: number): Promise<CuponEntity | null> {
    const cupon = await this.cuponRepo.findOne({ where: { id: id } });
    if (!cupon) {
      throw new NotFoundException(`Cupon with ID ${id} not found`);
    }
    return cupon;
  }
//   async createDiscount(discountData: Partial<CuponEntity>, productId: number): Promise<CuponEntity | boolean> {
//     try {
//       // Fetch the product by the given productId
//       const product = await this.productService.SearchByIDWithoutDiscount(productId);
//       console.log("product:", product);
  
//       if (!product) {
//         throw new InternalServerErrorException('Product not found');
//       }
  
//       // If the product already has a discount, remove it
//       if (product.discount) {
//         let discount = product.discount;
//         product.discount = null;
    
//         console.log("before updating product");
          
//         // Update the product to remove the discount reference
//         await this.productService.editProduct(product.Id, product);
//       }
  
//       // Create the new discount
//       const discount = new CuponEntity();
//       discount.discountPercentage = discountData.discountPercentage;
//       discount.startDate = discountData.startDate;
//       discount.endDate = discountData.endDate;
  
//       // Assign the product to the discount
//       discount.products = [product]; // Wrap the product in an array
  
//       // Save the new discount and assign it to the product
//       const newDiscount = await this.cuponRepo.save(discount);
  
//       // Update the product with the new discount
//       product.discount = newDiscount;
//       await this.productService.editProduct(product.Id, product);
  
//       // Break the circular reference before returning the response
//       const responseDiscount = { ...newDiscount };
//       delete responseDiscount.products; // Remove products from the discount to avoid circular structure
  
//       return responseDiscount;
//     } catch (error) {
//       console.error('Error creating discount:', error);
//       throw new InternalServerErrorException('Error creating discount');
//     }
//   }
  
  
  
async createCupon(cuponData: Partial<CuponEntity>): Promise<CuponEntity> {
    const existingCupon = await this.cuponRepo.findOne({ where: { name: cuponData.name } });
  
    if (existingCupon) {
      throw new ConflictException('Cupon name already exists');
    }
  
    const cupon = this.cuponRepo.create(cuponData);
  
    try {
      return await this.cuponRepo.save(cupon);
    } catch (error) {
      console.error('Error creating cupon:', error.message);
      throw new InternalServerErrorException('Error creating cupon');
    }
  }
  

  async editCupon(id: number, cuponData: Partial<CuponEntity>): Promise<CuponEntity | boolean> {
    const cupon = await this.cuponRepo.findOne({ where: { id: id } });
    if (!cupon) {
      throw new NotFoundException(`Cupon with ID ${id} not found`);
    }

    try {
      await this.cuponRepo.update(id, cuponData);
      return await this.cuponRepo.findOne({ where: { id: id } });
    } catch (error) {
      console.error("Error updating cupon:", error.message);
      throw new InternalServerErrorException('Error updating cupon');
    }
  }

  async deleteCupon(id: number): Promise<boolean> {
    const cupon = await this.cuponRepo.findOne({ where: { id: id } });
    if (!cupon) {
      throw new NotFoundException(`cupon with ID ${id} not found`);
    }

    try {
      await this.cuponRepo.remove(cupon);
      return true;
    } catch (error) {
      console.error("Error deleting cupon:", error.message);
      throw new InternalServerErrorException('Error deleting cupon');
    }
  }

//   async applyDiscountToCollection(
//     collectionId: number,
//     discountData: Partial<CuponEntity>
//   ): Promise<{ success: boolean; message: string }> {
//     const collection = await this.collectionRepo.findOne({
//       where: { Id: collectionId },
//       relations: ['products', 'products.discount'],
//     });
  
//     if (!collection) {
//       throw new NotFoundException(`Collection with ID ${collectionId} not found`);
//     }
  
//     // Check for existing discount with the same unique fields
//     const existingDiscount = await this.cuponRepo.findOne({
//       where: {
//         discountPercentage: discountData.discountPercentage,
//         endDate: discountData.endDate,
//       },
//     });
  
//     let newDiscount: CuponEntity;
  
//     if (existingDiscount) {
//       console.log("Using existing discount:", existingDiscount);
//       newDiscount = existingDiscount; // Reuse the existing discount
//     } else {
//       // Create a new discount if it doesn't exist
//       newDiscount = this.cuponRepo.create(discountData);
//     }
  
//     // Apply the new discount to each product in the collection
//     for (const product of collection.products) {
//       if (product.discount) {
//         const discountId = product.discount.id;
//         console.log(`Product ID ${product.Id} has an existing discount ${discountId}. Removing it...`);
        
//         // Remove the discount reference from the product
//         product.discount = null;
//         await this.productService.editProduct(product.Id,product); // Save product after removing old discount
        
//         // Now delete the existing discount
//         // await this.cuponRepo.delete(discountId);
//         // console.log("deleted:", discountId);
//       }
//     }
  
//     // Save the new discount if it's a new one
//     if (!existingDiscount) {
//       console.log("added:", newDiscount);
//       await this.cuponRepo.save(newDiscount);
//     }
  
//     // Link the new discount to each product
//     for (const product of collection.products) {
//       product.discount = newDiscount;
//       console.log("product:", product);
//       await this.productService.editProduct(product.Id,product);
//     }
  
//     return { success: true, message: `Discount applied to collection and its products.` };
//   }
  @Cron('0 * * * *') // This will run the task every hour
  async deleteExpiredCupons(): Promise<void> {
    const now = new Date();
    try {
      const expiredCupons = await this.cuponRepo.find({
        where: { endDate: LessThan(now) },
      });

      if (expiredCupons.length > 0) {
        await this.cuponRepo.remove(expiredCupons);
        this.logger.log(`${expiredCupons.length} expired cupons deleted.`);
      }
    } catch (error) {
      this.logger.error('Error deleting expired cupons:', error.message);
    }
  }
}
