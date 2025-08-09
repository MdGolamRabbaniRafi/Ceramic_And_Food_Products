import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage, MulterError } from 'multer';
import { extname, resolve } from 'path';
import { OfferEntity } from './Offer.entity';
import { OfferService } from './Offer.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('offers')
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('add')
  @UseInterceptors(
    FileInterceptor('OfferPicture', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let urlPath = process.env.Offer_Image_Destination;

          if (urlPath.startsWith(process.env.Host_url)) {
            const localPath = urlPath.replace(
              process.env.Host_url,
              process.env.Host_path,
            );
            const resolvedPath = resolve(localPath);
            if (!fs.existsSync(resolvedPath)) {
              fs.mkdirSync(resolvedPath, { recursive: true });
            }

            cb(null, resolvedPath);
          } else {
            const resolvedPath = resolve(urlPath);
            if (!fs.existsSync(resolvedPath)) {
              fs.mkdirSync(resolvedPath, { recursive: true });
            }

            cb(null, resolvedPath);
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
  async createOffer(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<OfferEntity> {
    // Check if the file is provided
    if (!file) {
      throw new Error('No file uploaded.');
    }

    // Assuming the base URL is for accessing the image (not the local storage path)
    let imageUrl = process.env.Offer_Image_Destination;
    imageUrl = `${imageUrl}${file.filename}`;
    const isProduction = process.env.NODE_ENV === 'production';
    let finalUrl: string;
    const trimmedPath = imageUrl.replace(process.env.Host_path, '');

    if (isProduction) {
      finalUrl = `${process.env.Host_url}${trimmedPath}`;
    } else {
      finalUrl = trimmedPath;
    }

    const detailsObject = JSON.parse(body.Details);
    console.log(detailsObject);

    const data = {
      name: body.name,
      description: body.description,
      image: finalUrl,
      Details: detailsObject, // This will store it as an object in the database
    };
    console.log(data.Details);

    return this.offerService.createOffer(data);
  }

  @Get()
  async getAllOffers(): Promise<OfferEntity[]> {
    return this.offerService.getAllOffers();
  }

  @Get(':id')
  async getOfferById(
    @Param('id') id: number,
  ): Promise<OfferEntity | { message: string }> {
    return this.offerService.getOfferById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('OfferPicture', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let urlPath = process.env.Offer_Image_Destination;

          if (urlPath.startsWith(process.env.Host_url)) {
            const localPath = urlPath.replace(
              process.env.Host_url,
              process.env.Host_path,
            );
            const resolvedPath = resolve(localPath);
            if (!fs.existsSync(resolvedPath)) {
              fs.mkdirSync(resolvedPath, { recursive: true });
            }

            cb(null, resolvedPath);
          } else {
            const resolvedPath = resolve(urlPath);
            if (!fs.existsSync(resolvedPath)) {
              fs.mkdirSync(resolvedPath, { recursive: true });
            }

            cb(null, resolvedPath);
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
  async updateOffer(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Body() body: Partial<OfferEntity>,
  ): Promise<OfferEntity | { message: string }> {
    if (file != null) {
      let imageUrl = process.env.Offer_Image_Destination;
      imageUrl = `${imageUrl}${file.filename}`;
      const isProduction = process.env.NODE_ENV === 'production';
      let finalUrl: string;
      const trimmedPath = imageUrl.replace(process.env.Host_path, '');

      if (isProduction) {
        finalUrl = `${process.env.Host_url}${trimmedPath}`;
      } else {
        finalUrl = trimmedPath;
      }
      body.image = finalUrl;
    }

    return this.offerService.updateOffer(id, body);
  }

  @Delete(':id')
  async deleteOffer(
    @Param('id') id: number,
  ): Promise<{ message: string; success: boolean }> {
    return this.offerService.deleteOffer(id);
  }
}
