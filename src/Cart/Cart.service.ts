import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CartEntity } from './Cart.entity';
import { UserEntity } from 'src/User/User.entity';
import { ProductEntity } from 'src/Product/Product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepo: Repository<CartEntity>,
    @InjectRepository(ProductEntity)  // Inject ProductEntity repository
    private productRepo: Repository<ProductEntity>,
  ) {}

  async findByUserId(userId: number): Promise<CartEntity[]> {
    const cartEntities = await this.cartRepo.find({
        where: { user: { Id: userId } },
        relations: ['user'],  // Only relate 'user', not 'products'
    });

    // Process images and discounts
    cartEntities.forEach(cart => {
      if (cart.products) {  // Make sure 'products' is defined
        cart.products.forEach(p => {
            if (typeof p.product.image === 'string') {
                p.product.image = p.product.image
                    .split(',')
                    .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
                    .join(',');
            }
            if (p.product.discount) {
                p.product['discountedPrice'] = this.calculateDiscountedPrice(p.product.price, p.product.discount.discountPercentage);
            }
        });
      }
  
      // Process user image
      if (cart.user && typeof cart.user.Image === 'string') {
          cart.user.Image = cart.user.Image.replace('/home/farseit1/public_html', 'https://farseit.com');
      }
    });

    return cartEntities;
}


private calculateDiscountedPrice(price: number, discountPercentage: number): number {
  const discountAmount = price * (discountPercentage / 100);
  return parseFloat((price - discountAmount).toFixed(2)); // Round to 2 decimal places
}
  // async addToCart(cartEntity: CartEntity): Promise<boolean> {
  //   const cart = await this.cartRepo.save(cartEntity);
  //   return cart ? true : false;
  // }

  async addToCart(cartData: { userId: number; productId: number }): Promise<{ success: boolean; message: string, cart:CartEntity }> {
    const { userId, productId } = cartData;
    console.log("cartData", cartData);

    // Fetch the product
    const productEntity = await this.productRepo.findOne({
        where: { Id: productId },
    });

    if (!productEntity) {
        return { success: false, message: "Product does not exist",cart:null };
    }

    // Fetch the user's cart (without the "products" relation)
    let cart = await this.cartRepo.findOne({
        where: { user: { Id: userId } },
    });

    if (cart) {
        console.log("cart", cart);

        // Initialize products array if empty
        let products = cart.products || [];

        // Check if the product is already in the cart
        const existingProduct = products.find(p => p.product.Id === productId);


        if (existingProduct) {
          existingProduct.product.image=existingProduct.product.image
          .split(',') // Split by comma if multiple images are stored as a string
          .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
          .join(','); 
            existingProduct.quantity += 1; // Increase quantity
        } else {
          productEntity.image=productEntity.image
          .split(',') // Split by comma if multiple images are stored as a string
          .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
          .join(','); 
            products.push({ product: productEntity, quantity: 1 }); // Add new product
        }

        // Update the cart's product list
        cart.products = products;
        await this.cartRepo.save(cart);
    } else {
        // Create a new cart if none exists
        console.log("Creating new cart");
        cart = new CartEntity();
        cart.user = { Id: userId } as UserEntity;
        cart.products = [{ product: productEntity, quantity: 1 }];
        
        cart.session_id = Math.floor(Math.random() * 1000000);
        cart.date = new Date();
        cart.products.forEach(p => {
          if (typeof p.product.image === 'string') {
            // Convert the string to an array, process it, and convert it back to a string
            p.product.image = p.product.image
                .split(',') // Split by comma if multiple images are stored as a string
                .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
                .join(','); // Join back into a string
        }
          if (p.product.discount) {
            const discountedPrice = this.calculateDiscountedPrice(p.product.price, p.product.discount.discountPercentage);
            p['discountedPrice'] = discountedPrice;
          }
          // delete product.discount; // Remove the discount object
        });
        await this.cartRepo.save(cart);
    }

    return { success: true, message: "Product added to cart successfully",cart };
}
async ProductCount(userId: number): Promise<number> {
  // Fetch the user's cart with products (as JSON)
  const cart = await this.cartRepo.findOne({
    where: { user: { Id: userId } },
  });

  if (!cart) {
    return 0;  // If the cart doesn't exist, return 0
  }

  // Count the number of different products (distinct by product Id)
  const uniqueProducts = new Set(cart.products.map(product => product.product.Id));

  return uniqueProducts.size;  // Return the count of unique products
}


async reduceToCart(cartData: { userId: number; productId: number }): Promise<{ success: boolean; message: string; cart: CartEntity }> {
  const { userId, productId } = cartData;
  console.log("cartData", cartData);

  // Fetch the product
  const productEntity = await this.productRepo.findOne({
      where: { Id: productId },
  });

  if (!productEntity) {
      return { success: false, message: "Product does not exist", cart: null };
  }

  // Fetch the user's cart (without the "products" relation)
  let cart = await this.cartRepo.findOne({
      where: { user: { Id: userId } },
  });

  if (cart) {
      console.log("cart", JSON.stringify(cart));

      // Initialize products array if empty
      let products = cart.products || [];

      // Check if the product is already in the cart
      const existingProduct = products.find(p => p.product.Id === Number(productId));  // Ensure comparison is between numbers

      if (existingProduct) {
          // Reduce the quantity by 1
          if (existingProduct.quantity > 1) {
            existingProduct.product.image=existingProduct.product.image
            .split(',') // Split by comma if multiple images are stored as a string
            .map(imgPath => imgPath.replace('/home/farseit1/public_html', 'https://farseit.com'))
            .join(','); 
              existingProduct.quantity -= 1; // Decrease quantity
          } else {
              // Remove product if quantity reaches 0
              products = products.filter(p => p.product.Id !== Number(productId));  // Ensure comparison is between numbers
          }
      } else {
          return { success: false, message: "Product not found in cart", cart: null };
      }
      if (products.length === 0) {
        await this.cartRepo.remove(cart);  // Remove the cart if no products are left
        return { success: true, message: "Cart is now empty and has been removed", cart: null };
    }
      // Update the cart's product list
      cart.products = products;
      await this.cartRepo.save(cart);

  } else {
      return { success: false, message: "Cart not found", cart: null };
  }

  return { success: true, message: "Product quantity reduced by one", cart: cart };
}




async removeProductFromCart(userId: number, productId: number): Promise<{ success: boolean; message: string }> {
  const numericProductId = Number(productId);

  // Fetch the user's cart (without relations)
  let cart = await this.cartRepo.findOne({
      where: { user: { Id: userId } },
  });

  if (!cart) {
      return { success: false, message: "Cart not found" };
  }

  // Check if products are present and map them
  if (!cart.products) {
      return { success: false, message: "No products in cart" };
  }

  // Log product IDs for debugging
  console.log("Cart Products IDs:", cart.products.map(p => p.product.Id));
  console.log("Product to remove:", numericProductId);

  // Check if the product exists in the cart
  const productExists = cart.products.some(p => p.product.Id === numericProductId);
  if (!productExists) {
      return { success: false, message: "Product not found in cart" };
  }

  // Remove the product from the cart's products list
  cart.products = cart.products.filter(p => p.product.Id !== numericProductId);

  // Update the cart with the new products list
  await this.cartRepo.save(cart);

  console.log("Product removed from cart in DB.");

  return { success: true, message: "Product removed from cart successfully" };
}


  
  
  async deleteByUserId(userId: number): Promise<boolean> {
    const result = await this.cartRepo.delete({ user: { Id: userId } });
    return result.affected > 0;
  }
}
