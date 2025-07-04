import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { ProductEntity } from './Product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {}

  getHello(): string {
    return 'Hello Product!';
  }

  // New method to calculate the discounted price
  private calculateDiscountedPrice(
    price: number,
    discountPercentage: number,
  ): number {
    const discountAmount = price * (discountPercentage / 100);
    return parseFloat((price - discountAmount).toFixed(2)); // Round to 2 decimal places
  }

  async SearchByID(Id: number): Promise<any | null> {
    const productEntity = await this.productRepo.findOne({
      where: { Id },
      relations: ['discount', 'category'],
    });

    if (!productEntity) {
      return null;
    }

    // Clean and format image paths
    if (typeof productEntity.image === 'string') {
      const imageArray = productEntity.image.split(',');

      const updatedImageArray = imageArray.map((imgPath) => {
        const trimmed = imgPath.trim();

        // Remove domain and return in format "https:/Upload/Product/..."
        const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
        return `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
      });

      // Store updated string (optional, used internally)
      productEntity.image = updatedImageArray.join(',');
    }

    // Add discounted price if applicable
    if (productEntity.discount) {
      const discountedPrice = this.calculateDiscountedPrice(
        productEntity.price,
        productEntity.discount.discountPercentage,
      );
      productEntity['discountedPrice'] = discountedPrice;
    }

    return {
      ...productEntity,
      image: productEntity.image.split(','), // Final formatted array
    };
  }

  // async SearchByID(Id: number): Promise<ProductEntity | null> {
  //   let productEntity = await this.productRepo.findOne({
  //     where: { Id },
  //     relations: ['discount']
  //   });

  //   if (!productEntity) {
  //       return null;
  //   }

  //   // Ensure image exists and is a string before processing
  //   if (typeof productEntity.image === 'string') {
  //       console.log("Before Replacement:", productEntity.image);

  //       // Step 1: Split into an array
  //       const imageArray = productEntity.image.split(',');

  //       // Step 2: Replace the base path and remove "$" symbols if present
  //       const updatedImageArray = imageArray.map(imgPath =>
  //           imgPath.replace('$', '').replace('/home/farseit1/public_html', 'https://farseit.com')
  //       );

  //       // Step 3: Push updated image paths back to productEntity.image array
  //       productEntity.image = updatedImageArray[1];  // Update the image array with the modified paths
  //       console.log("After Replacement:", productEntity.image);
  //   }

  //   // Check if there is a discount and calculate the discounted price
  //   if (productEntity.discount) {
  //       const discountedPrice = this.calculateDiscountedPrice(
  //           productEntity.price,
  //           productEntity.discount.discountPercentage
  //       );
  //       productEntity['discountedPrice'] = discountedPrice;
  //   }

  //   // Return the product entity with updated image array
  //   return productEntity;
  // }

  async SearchByIDWithoutDiscount(Id: number): Promise<ProductEntity | null> {
    let productEntity = await this.productRepo.findOne({
      where: { Id },
      relations: ['discount', 'category'],
    });

    if (productEntity) {
      // Check if there is a discount and calculate the discounted price
      // if (productEntity.discount) {
      //   const discountedPrice = this.calculateDiscountedPrice(productEntity.price, productEntity.discount.discountPercentage);
      //   productEntity['discountedPrice'] = discountedPrice;
      // }

      // Remove the discount object from the returned entity
      // delete productEntity.discount;

      return productEntity;
    }

    return null;
  }

  async Search(): Promise<ProductEntity[] | null> {
    const productEntities = await this.productRepo.find({
      relations: ['discount', 'category'],
    });

    if (productEntities.length >= 0) {
      productEntities.forEach((product) => {
        // Handle image field formatting
        if (typeof product.image === 'string') {
          product.image = product.image
            .split(',')
            .map((imgPath) => {
              const trimmed = imgPath.trim();

              // Remove full host like "https://ceramicandfoodproducts.com/"
              const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');

              // Return in "https:/Upload/Product/..." format
              return `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
            })
            .join(',');
        }

        // Handle discount
        if (product.discount) {
          const discountedPrice = this.calculateDiscountedPrice(
            product.price,
            product.discount.discountPercentage,
          );
          product['discountedPrice'] = discountedPrice;
        }
      });

      return productEntities;
    }

    return null;
  }

  async SearchByCategoryID(categoryId: number): Promise<any[] | null> {
    const productEntities = await this.productRepo.find({
      where: { category: { Id: categoryId } },
      relations: ['discount', 'category'],
    });

    if (productEntities.length > 0) {
      productEntities.forEach((product) => {
        if (typeof product.image === 'string') {
          const updatedImageArray = product.image.split(',').map((imgPath) => {
            const trimmed = imgPath.trim();
            const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
            return `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
          });

          product.image = updatedImageArray.join(',');
        }

        if (product.discount) {
          const discountedPrice = this.calculateDiscountedPrice(
            product.price,
            product.discount.discountPercentage,
          );
          product['discountedPrice'] = discountedPrice;
        }
      });

      // Fix: change image to array AFTER processing, return as `any[]`
      return productEntities.map((product) => ({
        ...product,
        image: product.image.split(','), // Make image an array
      }));
    }

    return null;
  }

  async addProduct(
    productData: Partial<ProductEntity>,
  ): Promise<ProductEntity | boolean> {
    try {
      if (!productData.image || typeof productData.image !== 'string') {
        throw new BadRequestException(
          'The image field is required and must be a string.',
        );
      }

      if (!productData.name || typeof productData.name !== 'string') {
        throw new BadRequestException(
          'The name field is required and must be a string.',
        );
      }

      if (!productData.desc || typeof productData.desc !== 'string') {
        throw new BadRequestException(
          'The desc field is required and must be a string.',
        );
      }

      if (
        Number.isNaN(productData.price) ||
        productData.price == null ||
        typeof productData.price !== 'number' ||
        productData.price < 0
      ) {
        throw new BadRequestException(
          'The price field is required and must be a positive number.',
        );
      }

      if (
        productData.quantity == null ||
        typeof productData.quantity !== 'number' ||
        productData.quantity < 0
      ) {
        throw new BadRequestException(
          'The quantity field is required and must be a non-negative integer.',
        );
      }

      if (typeof productData.json_attribute === 'string') {
        productData.json_attribute = JSON.parse(
          productData.json_attribute,
        ) as JsonAttribute;
      }

      if (
        productData.json_attribute &&
        typeof productData.json_attribute === 'object'
      ) {
        const attributes = (productData.json_attribute as JsonAttribute)
          .attributes;

        if (!attributes || typeof attributes !== 'object') {
          throw new BadRequestException('Invalid attribute structure.');
        }

        let quantityMismatch = false;
        let mismatchAttribute: string | null = null;

        for (const [key, value] of Object.entries(attributes)) {
          if (typeof value !== 'object') {
            throw new BadRequestException(
              `Invalid attribute values for "${key}".`,
            );
          }

          let attributeTotal = 0;

          for (const qty of Object.values(value)) {
            if (typeof qty !== 'number' || qty < 0) {
              throw new BadRequestException(
                `Invalid quantity in attribute "${key}".`,
              );
            }
            attributeTotal += qty;
          }

          if (attributeTotal != productData.quantity) {
            quantityMismatch = true;
            mismatchAttribute = key;
            break;
          }
        }
        if (quantityMismatch) {
          throw new BadRequestException(
            'The total quantity for ' +
              mismatchAttribute +
              ' does not match the original quantity ' +
              productData.quantity +
              '.',
          );
        }
      }

      const productDetails = await this.productRepo.save(productData);

      if (productDetails != null) {
        return productDetails;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error saving product details:', error.message);
      throw new InternalServerErrorException('Error saving product details');
    }
  }

  async updateProductQuantity(product: Partial<ProductEntity>): Promise<void> {
    if (
      product.quantity === undefined ||
      product.json_attribute === undefined
    ) {
      throw new Error('Quantity or JSON attribute not defined.');
    }

    const productRepo = this.productRepo;

    // Ensure valid update values are provided before calling .set()
    const updatedValues: any = {
      quantity: product.quantity,
      json_attribute: product.json_attribute,
    };

    await productRepo
      .createQueryBuilder()
      .update(ProductEntity)
      .set(updatedValues) // Pass the values to update
      .where('Id = :Id', { Id: product.Id }) // Use named parameter
      .execute();
  }

  async editProduct(
    id: number,
    productData: Partial<ProductEntity>,
  ): Promise<ProductEntity | { message: string }> {
    const product = await this.productRepo.findOne({ where: { Id: id } });
    if (!product) {
      return { message: `Product with ID ${id} not found` };
    }

    try {
      if (productData.image != null && typeof productData.image !== 'string')
        return { message: `The image field is required and must be a string.` };
      {
      }
      if (productData.image && product.image !== productData.image) {
        if (product.image) {
          const imageArray = product.image.split(',');
          imageArray.forEach(async (img) => {
            const res = await this.deleteImageFile(img);
            console.log(product.image);
            if (res.message != 'File deleted successfully') {
              return res;
            }
          });
        }
      }

      if (productData.name != null && typeof productData.name !== 'string') {
        return { message: `The name field is required and must be a string.` };
      }

      if (productData.desc != null && typeof productData.desc !== 'string') {
        return { message: `The desc field is required and must be a string.` };
      }

      if (productData.price !== undefined) {
        if (
          Number.isNaN(productData.price) ||
          typeof productData.price !== 'number' ||
          productData.price < 0
        ) {
          return { message: `The price field must be a positive number.` };
        }
      }

      //   console.log(typeof productData.quantity);

      if (
        (productData.quantity != null &&
          typeof productData.quantity !== 'number') ||
        productData.quantity < 0
      ) {
        return {
          message: `The quantity field is required and must be a non-negative integer..`,
        };
      }

      if (typeof productData.json_attribute === 'string') {
        productData.json_attribute = JSON.parse(
          productData.json_attribute,
        ) as JsonAttribute;
      }

      if (
        productData.json_attribute &&
        typeof productData.json_attribute === 'object'
      ) {
        const attributes = (productData.json_attribute as JsonAttribute)
          .attributes;

        if (!attributes || typeof attributes !== 'object') {
          return { message: `Invalid attribute structure.` };
        }

        let quantityMismatch = false;
        let mismatchAttribute: string | null = null;

        for (const [key, value] of Object.entries(attributes)) {
          if (typeof value !== 'object') {
            return { message: `Invalid attribute values for "${key}".` };
          }

          let attributeTotal = 0;

          for (const qty of Object.values(value)) {
            if (typeof qty !== 'number' || qty < 0) {
              return { message: `Invalid quantity in attribute "${key}".` };
            }
            attributeTotal += qty;
          }

          if (attributeTotal != product.quantity) {
            quantityMismatch = true;
            mismatchAttribute = key;
            break;
          }
        }
        if (quantityMismatch) {
          return {
            message:
              'The total quantity for ' +
              mismatchAttribute +
              ' does not match the original quantity ' +
              product.quantity +
              '.',
          };
        }
      }

      await this.productRepo.update(id, productData);
      return await this.productRepo.findOne({ where: { Id: id } });
    } catch (error) {
      console.error('Error editing product details:', error.message);
      return { message: 'Error editing product details' };
    }
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const product = await this.productRepo.findOne({ where: { Id: id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.image) {
      const imageArray = product.image.split(',').map((img) => img.trim());

      const deletionResults = await Promise.all(
        imageArray.map((img) => this.deleteImageFile(img)),
      );

      const failedDeletions = deletionResults.filter(
        (res) => res.message !== 'File deleted successfully',
      );

      if (failedDeletions.length > 0) {
        // Prevent deletion and report which images failed
        const failedMessages = failedDeletions
          .map((res) => res.message)
          .join('; ');
        return { message: `Product deletion aborted: ${failedMessages}` };
      }
    }

    try {
      await this.productRepo.delete(id);
      return { message: 'Product removed successfully' };
    } catch (error) {
      console.error('Error removing product:', error.message);
      throw new InternalServerErrorException('Error removing product');
    }
  }

  async deleteImageFile(imagePath: string): Promise<{ message: string }> {
    console.log('imagePath', imagePath);
    if (!imagePath) {
      return { message: 'No image path provided' };
    }

    // Normalize incorrect slashes
    if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
      imagePath = imagePath.replace('https:/', 'https://');
    }

    // Extract filename from URL
    const fileName = path.basename(imagePath);
    console.log('basename:', fileName);

    // Determine environment
    const isProduction =
      process.env.NODE_ENV === 'production' || process.platform !== 'win32';

    // Get upload path from .env
    let uploadDir = process.env.Product_Image_Destination || '';

    // If in production and image path starts with Host_url, convert URL to local path
    if (
      isProduction &&
      process.env.Host_url &&
      imagePath.startsWith(process.env.Host_url)
    ) {
      uploadDir = process.env.Host_path
        ? path.join(
            process.env.Host_path,
            uploadDir.replace(process.env.Host_path, ''),
          )
        : uploadDir;
    }

    // Construct local file path
    const localImagePath = path.join(uploadDir, fileName);
    console.log('Resolved path for deletion:', localImagePath);

    // Check if file exists
    try {
      await fs.access(localImagePath);
    } catch (err) {
      console.error('File not found:', localImagePath);
      return { message: 'File not found' };
    }

    // Attempt deletion
    try {
      await fs.unlink(localImagePath);
      console.log('File deleted:', fileName);
      return { message: 'File deleted successfully' };
    } catch (err) {
      console.error('Failed to delete:', localImagePath, err);
      return { message: 'Failed to delete file' };
    }
  }

  async ForcefullyDelete(id: number): Promise<{ message: string }> {
    const product = await this.productRepo.findOne({ where: { Id: id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      await this.productRepo.delete(id);
      return { message: 'Product removed successfully' };
    } catch (error) {
      console.error('Error removing product:', error.message);
      throw new InternalServerErrorException('Error removing product');
    }
  }

  // private async deleteImageFiles(imagePaths: string): Promise<{ message: string }> {
  //   const imageArray = imagePaths.split(',').map(image => image.trim());

  //   const deletionPromises = imageArray.map(imagePath => {
  //     // Convert to local path if needed
  //     const localImagePath = imagePath.replace(process.env.Host_path, process.env.Host_url);
  //     const resolvedPath = path.resolve(localImagePath);

  //     return new Promise<void>((resolve, reject) => {
  //       fs.unlink(resolvedPath, (err) => {
  //         if (err) {
  //           reject(`Failed to delete: ${resolvedPath} - ${err.message}`);
  //         } else {
  //           resolve();
  //         }
  //       });
  //     });
  //   });

  //   const results = await Promise.allSettled(deletionPromises);

  //   const failedMessages = results
  //     .filter(result => result.status === 'rejected')
  //     .map(result => (result as PromiseRejectedResult).reason);

  //   if (failedMessages.length > 0) {
  //     return { message: `Failed to delete image(s):\n${failedMessages.join('\n')}` };
  //   }

  //   return { message: 'Successfully deleted all images.' };
  // }
}
type JsonAttribute = {
  attributes: {
    [key: string]: {
      [subKey: string]: number; // Sub-attributes should have numeric values
    };
  };
};
