"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Cupon_entity_1 = require("../Cupon/Cupon.entity");
const OrderProductMapper_entity_1 = require("../Mapper/Order Product Mapper/OrderProductMapper.entity");
const Product_service_1 = require("../Product/Product.service");
const typeorm_2 = require("typeorm");
const Order_entity_1 = require("./Order.entity");
let OrderService = class OrderService {
    constructor(orderRepo, orderProductMapperRepo, productService) {
        this.orderRepo = orderRepo;
        this.orderProductMapperRepo = orderProductMapperRepo;
        this.productService = productService;
    }
    getHello() {
        return 'Hello Order!';
    }
    async changeStatus(id, status) {
        let order = await this.orderRepo.findOne({ where: { Id: id } });
        if (!order) {
            return { message: 'Order not found' };
        }
        order.status = status;
        await this.orderRepo.update(id, order);
        return order;
    }
    async editOrder(orderId, updatedOrderData) {
        try {
            const order = await this.orderRepo.findOne({ where: { Id: orderId } });
            if (!order) {
                return `Order with ID ${orderId} not found.`;
            }
            try {
                let totalOriginalPrice = 0;
                let totalDiscountedPrice = 0;
                const orderProductMappers = [];
                if (updatedOrderData.cupon) {
                    const cupon = await this.orderRepo.manager.findOne(Cupon_entity_1.CuponEntity, {
                        where: { id: updatedOrderData.cupon.id },
                    });
                    if (!cupon) {
                        return `Coupon with ID ${updatedOrderData.cupon.id} is not valid.`;
                    }
                    const currentDate = new Date();
                    if (currentDate < cupon.startDate || currentDate > cupon.endDate) {
                        return `Coupon "${cupon.name}" is not valid within the current date range.`;
                    }
                    updatedOrderData.cupon = cupon;
                }
                if (Array.isArray(updatedOrderData.products) &&
                    updatedOrderData.products.length > 0) {
                    for (const product of updatedOrderData.products) {
                        console.log('json_attribute for product', product.Id, product.json_attribute);
                        const productResponse = await this.productService.SearchByID(product.Id);
                        if (!productResponse) {
                            throw new Error(`Product with ID ${product.Id} not found.`);
                        }
                        const price = parseFloat(productResponse.price);
                        if (isNaN(price)) {
                            throw new Error(`Invalid price for product ID ${product.Id}`);
                        }
                        totalOriginalPrice += price;
                        if (productResponse.discount) {
                            const discountPercent = productResponse.discount.discountPercentage || 0;
                            totalDiscountedPrice += price - (price * discountPercent) / 100;
                        }
                        else {
                            totalDiscountedPrice += price;
                        }
                        let jsonAttribute = productResponse.json_attribute || {};
                        if (product.json_attribute) {
                            try {
                                jsonAttribute =
                                    typeof product.json_attribute === 'string'
                                        ? JSON.parse(product.json_attribute)
                                        : product.json_attribute;
                                if ('attributes' in jsonAttribute) {
                                    const attributes = productResponse.json_attribute.attributes;
                                    for (const [key, value] of Object.entries(jsonAttribute.attributes)) {
                                        if (!attributes[key]) {
                                            throw new Error(`Attribute "${key}" not found for product ${product.Id}.`);
                                        }
                                        for (const [subKey, qty] of Object.entries(value)) {
                                            if (!attributes[key][subKey]) {
                                                throw new Error(`Sub-attribute "${subKey}" not found in "${key}" for product ${product.Id}.`);
                                            }
                                            if (attributes[key][subKey] < qty) {
                                                throw new Error(`Insufficient quantity for "${subKey}" in "${key}" for product ${product.Id}.`);
                                            }
                                            attributes[key][subKey] -= qty;
                                            console.log(`Decremented ${subKey} in ${key} for product ${product.Id}`);
                                        }
                                    }
                                    productResponse.json_attribute = { attributes };
                                }
                                else {
                                    throw new Error(`Malformed attributes for product ${product.Id}.`);
                                }
                            }
                            catch (error) {
                                console.error(`Error processing attributes for product ${product.Id}:`, error.message);
                                throw error;
                            }
                        }
                        else {
                            throw new Error('json_attribute not found for product');
                        }
                        productResponse.quantity -= product.quantity;
                        if (productResponse.quantity < 0) {
                            return `The order quantity of ${productResponse.name} is greater than the remaining quantity.`;
                        }
                        if (productResponse.quantity === undefined ||
                            productResponse.json_attribute === undefined) {
                            throw new Error('Quantity or JSON attribute not defined.');
                        }
                        console.log('Updating product with:', productResponse.Id, productResponse.quantity, productResponse.json_attribute);
                        await this.productService.updateProductQuantity({
                            Id: productResponse.Id,
                            quantity: productResponse.quantity,
                            json_attribute: productResponse.json_attribute,
                        });
                        const orderProductMapper = this.orderProductMapperRepo.create({
                            product: productResponse,
                            json_attribute: jsonAttribute,
                        });
                        orderProductMappers.push(orderProductMapper);
                    }
                }
                updatedOrderData.originalPrice = totalOriginalPrice;
                updatedOrderData.discountedPrice = totalDiscountedPrice;
                updatedOrderData.totalAmount = updatedOrderData.cupon
                    ? Math.max(0, totalDiscountedPrice - updatedOrderData.cupon.amount)
                    : totalDiscountedPrice;
                updatedOrderData.date = new Date();
                delete updatedOrderData.products;
                await this.orderRepo.update(orderId, updatedOrderData);
                console.log('Order saved');
                await this.orderProductMapperRepo.delete({ order: { Id: orderId } });
                for (const mapper of orderProductMappers) {
                    mapper.order = order;
                    await this.orderProductMapperRepo.save(mapper);
                    console.log('Mapper saved');
                }
                const savedOrder = await this.orderRepo.findOne({
                    where: { Id: orderId },
                });
                return savedOrder
                    ? `Order Updated successfully.`
                    : `Failed to place the order.`;
            }
            catch (error) {
                console.error('Error adding order:', error.message);
                throw error;
            }
        }
        catch (error) {
            console.error('Error updating order:', error.message);
            throw new Error('Failed to update order.' + error.message);
        }
    }
    async searchOrder() {
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
                order: { date: 'DESC' },
            });
            return orders.map((order) => ({
                Id: order.Id,
                user: order.user,
                originalPrice: order.originalPrice,
                discountedPrice: order.discountedPrice,
                totalAmount: order.totalAmount,
                date: order.date,
                status: order.status,
                address: order.address,
                district: order.district,
                note: order.note,
                receiverPhone: order.receiverPhone,
                isActive: order.isActive,
                cupon: order.cupon
                    ? {
                        id: order.cupon.id,
                        name: order.cupon.name,
                        amount: order.cupon.amount,
                    }
                    : null,
                payment: order.payment
                    ? { Id: order.payment.Id, status: order.payment.status }
                    : null,
                products: order.orderProductMappers.map((mapper) => ({
                    Id: mapper.product.Id,
                    name: mapper.product.name,
                    price: mapper.product.price,
                    discount: mapper.product.discount
                        ? mapper.product.discount.discountPercentage
                        : 0,
                    json_attribute: mapper.json_attribute,
                })),
            }));
        }
        catch (error) {
            console.error('Error searching orders:', error.message);
            throw new Error('Failed to fetch orders.');
        }
    }
    async getOrderById(id) {
        try {
            const order = await this.orderRepo.findOne({
                where: { Id: id },
                relations: [
                    'user',
                    'cupon',
                    'orderProductMappers',
                    'orderProductMappers.product',
                    'products',
                    'payment',
                ],
            });
            if (!order) {
                return { message: `Order with ID ${id} not found.` };
            }
            return {
                Id: order.Id,
                user: order.user,
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
                payment: order.payment
                    ? { Id: order.payment.Id, status: order.payment.status }
                    : null,
                products: order.orderProductMappers.map((mapper) => ({
                    Id: mapper.product.Id,
                    name: mapper.product.name,
                    price: mapper.product.price,
                    discount: mapper.product.discount
                        ? mapper.product.discount.discountPercentage
                        : 0,
                    json_attribute: mapper.json_attribute,
                })),
            };
        }
        catch (error) {
            console.error('Error fetching order by ID:', error.message);
            throw new Error('Failed to fetch order.');
        }
    }
    async addOrder(orderData) {
        try {
            const userId = orderData.user.Id;
            const hasInactiveOrder = await this.hasInactiveOrder(userId);
            if (hasInactiveOrder) {
                return {
                    message: `This user have Inactive order. please confirm that order or remove that order first.`,
                };
            }
            let totalOriginalPrice = 0;
            let totalDiscountedPrice = 0;
            const orderProductMappers = [];
            if (orderData.cupon) {
                const cupon = await this.orderRepo.manager.findOne(Cupon_entity_1.CuponEntity, {
                    where: { id: orderData.cupon.id },
                });
                if (!cupon) {
                    return {
                        message: `Coupon with ID ${orderData.cupon.id} is not valid.`,
                    };
                }
                const currentDate = new Date();
                if (currentDate < cupon.startDate || currentDate > cupon.endDate) {
                    return {
                        message: `Coupon "${cupon.name}" is not valid within the current date range.`,
                    };
                }
                orderData.cupon = cupon;
            }
            for (const product of orderData.products) {
                console.log('json_attribute for product', product.Id, product.json_attribute);
                const productResponse = await this.productService.SearchByID(product.Id);
                if (!productResponse) {
                    throw new Error(`Product with ID ${product.Id} not found.`);
                }
                const price = parseFloat(productResponse.price);
                if (isNaN(price)) {
                    throw new Error(`Invalid price for product ID ${product.Id}`);
                }
                totalOriginalPrice += price;
                if (productResponse.discount) {
                    const discountPercent = productResponse.discount.discountPercentage || 0;
                    totalDiscountedPrice += price - (price * discountPercent) / 100;
                }
                else {
                    totalDiscountedPrice += price;
                }
                let jsonAttribute = productResponse.json_attribute || {};
                if (product.json_attribute) {
                    try {
                        jsonAttribute =
                            typeof product.json_attribute === 'string'
                                ? JSON.parse(product.json_attribute)
                                : product.json_attribute;
                        if ('attributes' in jsonAttribute) {
                            const attributes = productResponse.json_attribute.attributes;
                            for (const [key, value] of Object.entries(jsonAttribute.attributes)) {
                                if (!attributes[key]) {
                                    throw new Error(`Attribute "${key}" not found for product ${product.Id}.`);
                                }
                                for (const [subKey, qty] of Object.entries(value)) {
                                    if (!attributes[key][subKey]) {
                                        throw new Error(`Sub-attribute "${subKey}" not found in "${key}" for product ${product.Id}.`);
                                    }
                                    if (attributes[key][subKey] < qty) {
                                        throw new Error(`Insufficient quantity for "${subKey}" in "${key}" for product ${product.Id}.`);
                                    }
                                    attributes[key][subKey] -= qty;
                                    console.log(`Decremented ${subKey} in ${key} for product ${product.Id}`);
                                }
                            }
                            productResponse.json_attribute = { attributes };
                        }
                        else {
                            throw new Error(`Malformed attributes for product ${product.Id}.`);
                        }
                    }
                    catch (error) {
                        console.error(`Error processing attributes for product ${product.Id}:`, error.message);
                        throw error;
                    }
                }
                else {
                    throw new Error('json_attribute not found for product');
                }
                productResponse.quantity -= product.quantity;
                if (productResponse.quantity < 0) {
                    return {
                        message: `The order quantity of ${productResponse.name} is greater than the remaining quantity.`,
                    };
                }
                if (productResponse.quantity === undefined ||
                    productResponse.json_attribute === undefined) {
                    throw new Error('Quantity or JSON attribute not defined.');
                }
                console.log('Updating product with:', productResponse.Id, productResponse.quantity, productResponse.json_attribute);
                await this.productService.updateProductQuantity({
                    Id: productResponse.Id,
                    quantity: productResponse.quantity,
                    json_attribute: productResponse.json_attribute,
                });
                const orderProductMapper = this.orderProductMapperRepo.create({
                    product: productResponse,
                    json_attribute: jsonAttribute,
                });
                orderProductMappers.push(orderProductMapper);
            }
            orderData.originalPrice = totalOriginalPrice;
            orderData.discountedPrice = totalDiscountedPrice;
            orderData.totalAmount = orderData.cupon
                ? Math.max(0, totalDiscountedPrice - orderData.cupon.amount)
                : totalDiscountedPrice;
            orderData.date = new Date();
            const savedOrder = await this.orderRepo.save(orderData);
            console.log('Order saved');
            for (const mapper of orderProductMappers) {
                mapper.order = savedOrder;
                await this.orderProductMapperRepo.save(mapper);
                console.log('Mapper saved');
            }
            return savedOrder
                ? savedOrder
                : { message: `Failed to place the order.` };
        }
        catch (error) {
            console.error('Error adding order:', error.message);
            throw error;
        }
    }
    async deleteOrder(orderId) {
        try {
            const order = await this.orderRepo.findOne({ where: { Id: orderId } });
            if (!order) {
                return `Order with ID ${orderId} not found.`;
            }
            await this.orderProductMapperRepo.delete({ order: { Id: orderId } });
            await this.orderRepo.delete(orderId);
            return `Order with ID ${orderId} deleted successfully.`;
        }
        catch (error) {
            console.error('Error deleting order:', error.message);
            throw new Error('Failed to delete order.');
        }
    }
    async getOrdersByUserId(userId) {
        return await this.orderRepo.find({
            where: { user: { Id: userId } },
            relations: ['orderProductMappers', 'products'],
        });
    }
    async getInactiveOrdersByUserId(userId) {
        try {
            const orders = await this.orderRepo.find({
                where: {
                    user: { Id: userId },
                    isActive: false,
                },
                relations: [
                    'user',
                    'cupon',
                    'orderProductMappers',
                    'orderProductMappers.product',
                    'products',
                    'payment',
                ],
                order: { date: 'DESC' },
            });
            return orders;
        }
        catch (error) {
            console.error('Error fetching inactive orders:', error.message);
            throw new Error('Failed to fetch inactive orders.');
        }
    }
    async deleteInactiveOrdersByUserId(userId) {
        try {
            const inactiveOrders = await this.orderRepo.find({
                where: { user: { Id: userId }, isActive: false },
                relations: ['orderProductMappers'],
            });
            if (inactiveOrders.length === 0) {
                return `No inactive orders found for user ID ${userId}.`;
            }
            for (const order of inactiveOrders) {
                await this.orderProductMapperRepo.delete({ order: { Id: order.Id } });
            }
            await this.orderRepo.delete(inactiveOrders.map((order) => order.Id));
            return `${inactiveOrders.length} inactive order(s) deleted successfully for user ID ${userId}.`;
        }
        catch (error) {
            console.error('Error deleting inactive orders:', error.message);
            throw new Error('Failed to delete inactive orders.');
        }
    }
    async hasInactiveOrder(userId) {
        try {
            const count = await this.orderRepo.count({
                where: { user: { Id: userId }, isActive: false },
            });
            return count > 0;
        }
        catch (error) {
            console.error('Error checking inactive orders:', error.message);
            throw new Error('Failed to check inactive orders.');
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Order_entity_1.OrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(OrderProductMapper_entity_1.OrderProductMapperEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        Product_service_1.ProductService])
], OrderService);
//# sourceMappingURL=Order.service.js.map