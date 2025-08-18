import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './Payment.service';
import { PaymentEntity } from './Payment.entity';
import { extname, resolve } from 'path';
import { diskStorage, MulterError } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return '';
  }
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 1000000 }, // 100 KB limit
      storage: diskStorage({
        destination: (req, file, cb) => {
          let urlPath = process.env.Payment_Image_Destination;

          // Detect CPanel or similar hosting and convert URL to local directory path dynamically
          if (urlPath.startsWith(process.env.Host_url)) {
            // Convert the public URL path to the local file system path
            const localPath = urlPath.replace(
              process.env.Host_url,
              process.env.Host_path,
            );
            cb(null, resolve(localPath)); // Save to the local path in the server
          } else {
            // For other environments, use the resolved path as it is
            cb(null, resolve(urlPath));
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          const filename = `${uniqueSuffix}${extension}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @Post('/addPayment')
  async addOrder(
    @Body() paymentData: PaymentEntity,
    @UploadedFile() myfile: Express.Multer.File,
  ): Promise<boolean> {
    let imageUrl = process.env.Payment_Image_Destination;
    imageUrl = `${imageUrl}${myfile.filename}`;
    const trimmedPath = imageUrl.replace(process.env.Host_path, '');
    const isProduction = process.env.NODE_ENV === 'production';
    let finalUrl: string;
    if (isProduction) {
      finalUrl = `${process.env.Host_url}${trimmedPath}`;
    } else {
      finalUrl = trimmedPath;
    }
    const Image = finalUrl;
    paymentData.image = Image;
    return await this.paymentService.add(paymentData);
  }

  @Put('/changeStatus/:id')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<boolean> {
    return this.paymentService.changeStatus(Number(id), status);
  }

  @Get('/findAll')
  async getAllPayments(): Promise<any[]> {
    return this.paymentService.findAll();
  }

  @Get('/findOne/:id')
  async getPaymentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentEntity> {
    return this.paymentService.findOneById(id);
  }

  @Delete('/remove/:id')
  async removePaymentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.paymentService.remove(id);
  }
}
