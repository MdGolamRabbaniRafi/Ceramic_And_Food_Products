import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishListEntity } from './WishList.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { UserEntity } from 'src/User/User.entity';

@Injectable()
export class WishListService {
  constructor( @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>, 
  @InjectRepository(WishListEntity) private wishlistRepo: Repository<WishListEntity>, 
  @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,){}

  async wishListProduct(myobj: { product: number, user: number }): Promise<WishListEntity | { message: string } | boolean> {
  console.log(myobj);

  const currentDateTime = new Date();
  const user = await this.userRepo.findOne({ where: { Id: myobj.user } });
  const product = await this.productRepo.findOne({ where: { Id: myobj.product } });

  if (!user || !product) {
    return { message: 'User or Product not found.' };
  }

  const wishListEntity = new WishListEntity();
  wishListEntity.user = user;
  wishListEntity.product = product;
  wishListEntity.date = currentDateTime;

  try {
    // Check if this product is already in the wishlist for the same user
    const existingWishlistItem = await this.wishlistRepo.findOne({
      where: {
        user: { Id: myobj.user },      // Match by user ID
        product: { Id: myobj.product } // Match by product ID
      },
    });

    // If the product already exists in the wishlist, return a message
    if (existingWishlistItem) {
      return { message: 'This product is already in your wishlist.' };
    }

    // If the product does not exist, add it to the wishlist
    const savedEntity = await this.wishlistRepo.save(wishListEntity);
    if (savedEntity) {
      return savedEntity;
    } else {
      return { message: 'Failed to save the wishlist product.' };
    }

  } catch (error) {
    console.error('Error saving wishlist product:', error);
    return false;
  }
}

  
  


  async showWishListProduct(username:number): Promise<WishListEntity[]> {
    return await this.wishlistRepo.find({where:{user:{Id:username}}, relations: ['product']});
  }
  async deleteWishListProduct(id: number): Promise<boolean | { message: string }> {
    try {
      const wishlistItem = await this.wishlistRepo.findOne({ where: { Id: id } });
      if (!wishlistItem) {
        return { message: 'Wishlist item not found.' };
      }

      await this.wishlistRepo.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting wishlist product:', error);
      return false;
    }
  }
}