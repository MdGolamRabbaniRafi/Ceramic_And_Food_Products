import { Controller, Get, Query } from '@nestjs/common';
import { GraphService } from './graph.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Graph')
@Controller('Graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get('monthly')
  async getMonthlySales() {
    return this.graphService.getMonthlySales();
  }

  @Get('date-range')
  async getSalesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.graphService.getSalesByDateRange(start, end);
  }

  @Get('weakly/now')
  async getWeeklySales() {
    return this.graphService.getCurrentWeekSales();
  }

  @Get('monthly/now')
  async getCurrentMonthSales() {
    return this.graphService.getMonthlySalesOnly();
  }

  @Get('sales/last-6-months')
  async getLastSixMonthsSales() {
    return this.graphService.getLastSixMonthsSales();
  }

  @Get('sales/last-12-months')
  async getLastTwelveMonthsSales() {
    return this.graphService.getLastTwelveMonthsSales();
  }
  @Get('/category-with-product-count')
  async getCategoriesWithProductCount() {
    return await this.graphService.getAllCategoriesWithProductCount();
  }
}
