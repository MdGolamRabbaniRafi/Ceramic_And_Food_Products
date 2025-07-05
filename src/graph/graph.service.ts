import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/Category/Category.entity';
import { OrderEntity } from 'src/Order/Order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GraphService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async getMonthlySales(): Promise<any> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalSales')
      .addSelect(
        "TO_CHAR(DATE_TRUNC('month', order.date), 'Month YYYY')",
        'month',
      )
      .where('order.status != :status', { status: 'Pending' })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<any> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalSales')
      .addSelect(
        "TO_CHAR(DATE_TRUNC('month', order.date), 'Month YYYY')",
        'month',
      )
      .where('order.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('order.status != :status', { status: 'Pending' })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getCurrentWeekSales(): Promise<any> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalSales')
      .where('order.status = :status', { status: 'Completed' })
      .andWhere(
        `
      order.date >= (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE) + 1) % 7) * INTERVAL '1 day')
    `,
      )
      .andWhere(
        `
      order.date < (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE) + 1) % 7) * INTERVAL '1 day' + INTERVAL '7 days')
    `,
      )
      .getRawOne();
  }

  async getMonthlySalesOnly(): Promise<any> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalSales')
      .where('order.status = :status', { status: 'Completed' }) // ✅ Only completed orders
      .andWhere("order.date >= DATE_TRUNC('month', CURRENT_DATE)")
      .andWhere(
        "order.date < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')",
      )
      .getRawOne();
  }

  async getLastSixMonthsSales(): Promise<any[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(DATE_TRUNC('month', order.date), 'Month YYYY')", 'month')
      .addSelect('SUM(order.totalAmount)', 'totalSales')
      .where('order.status != :status', { status: 'Pending' })
      .andWhere(
        "order.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')",
      ) // includes current month
      .andWhere(
        "order.date < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')",
      ) // exclusive upper bound
      .groupBy('month')
      .orderBy('MIN(order.date)', 'ASC') // ensure correct chronological order
      .getRawMany();
  }

  async getLastTwelveMonthsSales(): Promise<any[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(DATE_TRUNC('month', order.date), 'Month YYYY')", 'month')
      .addSelect('SUM(order.totalAmount)', 'totalSales')
      .where('order.status != :status', { status: 'Pending' })
      .andWhere(
        "order.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')",
      )
      .andWhere(
        "order.date < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')",
      )
      .groupBy('month')
      .orderBy('MIN(order.date)', 'ASC')
      .getRawMany();
  }

  async getAllCategoriesWithProductCount(): Promise<any[]> {
    return await this.categoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.product', 'product')
      .select('category.Id', 'id')
      .addSelect('category.name', 'name')
      .addSelect('COUNT(product.Id)', 'productCount')
      .groupBy('category.Id')
      .addGroupBy('category.name')
      .orderBy('category.name', 'ASC')
      .getRawMany();
  }
}
