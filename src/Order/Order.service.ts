import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { ProductService } from 'src/Product/Product.service';
import { ProductEntity } from 'src/Product/Product.entity';
import { CuponEntity } from 'src/Cupon/Cupon.entity';
import { OrderProductMapperEntity } from 'src/Mapper/Order Product Mapper/OrderProductMapper.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,

    @InjectRepository(OrderProductMapperEntity)
    private orderProductMapperRepo: Repository<OrderProductMapperEntity>,

    private readonly productService: ProductService,
  ) { }

  getHello(): string {
    return 'Hello Order!';
  }
  async editOrder(orderId: number, updatedOrderData: any): Promise<string> {
    try {
      const order = await this.orderRepo.findOne({ where: { Id: orderId } });
  
      if (!order) {
        return `Order with ID ${orderId} not found.`;
      }
  
      await this.orderRepo.update(orderId, updatedOrderData);
      return `Order with ID ${orderId} updated successfully.`;
    } catch (error) {
      console.error('Error updating order:', error.message);
      throw new Error('Failed to update order.');
    }
  }
  async searchOrder(): Promise<any> {
    try {
      const orders = await this.orderRepo.find({
        relations: [
          'user',
          'cupon',
          'orderProductMappers',
          'orderProductMappers.product',
          'products',
          'payment',
        ],
        order: { date: 'DESC' }, // Sort by latest order
      });
  
      return orders.map(order => ({
        Id: order.Id,
        user: order.user, // Include user
        originalPrice: order.originalPrice,
        discountedPrice: order.discountedPrice,
        totalAmount: order.totalAmount,
        date: order.date,
        status: order.status,
        cupon: order.cupon
          ? {
              id: order.cupon.id,
              name: order.cupon.name,
              amount: order.cupon.amount,
            }
          : null,
        payment: order.payment ? { Id: order.payment.Id, status: order.payment.status } : null,
        products: order.orderProductMappers.map(mapper => ({
          Id: mapper.product.Id,
          name: mapper.product.name,
          price: mapper.product.price,
          discount: mapper.product.discount ? mapper.product.discount.discountPercentage : 0,
          json_attribute: mapper.json_attribute, // Return product attributes
        })),
      }));
     // return orders;
    } catch (error) {
      console.error('Error searching orders:', error.message);
      throw new Error('Failed to fetch orders.');
    }
  }
  
  



  async addOrder(orderData: any): Promise<string> {
    try {
      let totalOriginalPrice = 0;
      let totalDiscountedPrice = 0;
      const orderProductMappers = [];
  
      // Validate coupon if provided
      if (orderData.cupon) {
        const cupon = await this.orderRepo.manager.findOne(CuponEntity, {
          where: { id: orderData.cupon.id },
        });
  
        if (!cupon) {
          return `Coupon with ID ${orderData.cupon.id} is not valid.`;
        }
  
        const currentDate = new Date();
        if (currentDate < cupon.startDate || currentDate > cupon.endDate) {
          return `Coupon "${cupon.name}" is not valid within the current date range.`;
        }
  
        orderData.cupon = cupon; // Associate valid coupon
      }
  
      for (const product of orderData.products) {
        console.log('json_attribute for product', product.Id, product.json_attribute);
  
        const productResponse = await this.productService.SearchByID(product.Id);
        if (!productResponse) {
          throw new Error(`Product with ID ${product.Id} not found.`);
        }
  
        // Calculate prices
        totalOriginalPrice += productResponse.price;
        totalDiscountedPrice += productResponse.discount
          ? productResponse.price - (productResponse.price * productResponse.discount.discountPercentage) / 100
          : productResponse.price;
  
        // Validate and decrement quantities in json_attributes
        let jsonAttribute: any = productResponse.json_attribute || {}; // Use existing json_attribute if malformed
        if (product.json_attribute) {
          console.log('json_attribute:', product.json_attribute); // Log to verify structure
          try {
            jsonAttribute = typeof product.json_attribute === 'string'
              ? JSON.parse(product.json_attribute) 
              : product.json_attribute;
        
              if ('attributes' in jsonAttribute) {
                const attributes = productResponse.json_attribute.attributes; // Existing product attributes
               
                // Loop through the attributes in the order and update the product attributes
                for (const [key, value] of Object.entries(jsonAttribute.attributes)) {
                  if (!attributes[key]) {
                    throw new Error(`Attribute "${key}" not found for product ${product.Id}.`);
                  }
                  
                  // Handle sub-attributes like 'color.red', 'size.small', etc.
                  for (const [subKey, qty] of Object.entries(value)) {
                    if (!attributes[key][subKey]) {
                      throw new Error(`Sub-attribute "${subKey}" not found for attribute "${key}" in product ${product.Id}.`);
                    }
                    if (attributes[key][subKey] < qty) {
                      throw new Error(`Insufficient quantity for "${subKey}" in attribute "${key}" for product ${product.Id}.`);
                    }
              
                    // Decrement the quantity in the attributes
                    attributes[key][subKey] -= qty;
                    console.log(`Decremented ${subKey} in ${key} for product ${product.Id}`);
                  }
                }
               
                // Save updated attributes back to the product
                productResponse.json_attribute = { attributes };
              } else {
                throw new Error(`Malformed attributes for product ${product.Id}.`);
              }
              
          } catch (error) {
            console.error(`Error processing attributes for product ${product.Id}:`, error.message);
          }
        } else {
          throw new Error('json_attribute not found for product');
        }
        
  
        // Decrement total product quantity
        productResponse.quantity -= product.quantity;
        if (productResponse.quantity < 0) {
          return `The order quantity of ${productResponse.name} is greater than the remaining quantity.`;
        }
  
        // Ensure json_attribute and quantity are correctly set before update
        if (productResponse.quantity === undefined || productResponse.json_attribute === undefined) {
          throw new Error('Quantity or JSON attribute not defined.');
        }
  
        console.log('Updating product with:', productResponse.Id, productResponse.quantity, productResponse.json_attribute);
  
        // Make sure you're updating the necessary fields
        await this.productService.updateProductQuantity({
          Id: productResponse.Id,
          quantity: productResponse.quantity,
          json_attribute: productResponse.json_attribute,
        });
        console.log("abcd")
  
        // Create order-product mapper
        const orderProductMapper = this.orderProductMapperRepo.create({
          product: productResponse,
          json_attribute: jsonAttribute, // Direct object storage
        });
        console.log("abcd2")

        orderProductMappers.push(orderProductMapper);
      }
  
      // Set final prices in the order
      orderData.originalPrice = totalOriginalPrice;
      orderData.discountedPrice = totalDiscountedPrice;
      orderData.totalAmount = orderData.cupon
        ? Math.max(0, totalDiscountedPrice - orderData.cupon.amount)
        : totalDiscountedPrice;
      orderData.date = new Date();
  
      // Save the order to get the auto-generated ID
      const savedOrder = await this.orderRepo.save(orderData);
      console.log("abcd3")

      // Save order-product mappings
      for (const mapper of orderProductMappers) {
        mapper.order = savedOrder; // Use the saved order's ID
        await this.orderProductMapperRepo.save(mapper);
        console.log("abcd4")
      }

      return savedOrder ? `Order placed successfully.` : `Failed to place the order.`;
    } catch (error) {
      console.error('Error adding order:', error.message);
      throw error;
    }
  }
}
interface JsonAttribute {
  attributes: {
    [key: string]: {
      [subKey: string]: number; // Quantity for each sub-attribute
    };
  };

  
}


