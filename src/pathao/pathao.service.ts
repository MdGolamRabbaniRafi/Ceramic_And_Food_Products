import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PathaoService {
  private apiKey = process.env.PATHAO_API_KEY;
  private baseUrl = process.env.PATHAO_BASE_URL;

  async createOrder(orderData: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/order/create`, // Update endpoint as per Pathao API
        orderData,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log("response:"+response.data)
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error creating order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
}
