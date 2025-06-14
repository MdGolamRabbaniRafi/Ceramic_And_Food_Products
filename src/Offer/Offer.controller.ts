import { Controller, Post, Get, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { OfferService } from './Offer.service';
import { OfferEntity } from './Offer.entity';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('add')
  @UseInterceptors(
    FileInterceptor('OfferPicture', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const urlPath = process.env.Offer_Image_Destination;
          // Convert the URL path to a local directory path dynamically
          const localPath = urlPath.replace('https://farseit.com', '/home/farseit1/public_html');
          cb(null, resolve(localPath)); // Save to the local path in the server
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = extname(file.originalname);
          const filename = `${uniqueSuffix}${extension}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async createOffer(@UploadedFile() file: Express.Multer.File, @Body() body: any): Promise<OfferEntity> {
    // Check if the file is provided
    if (!file) {
      throw new Error('No file uploaded.');
    }
  
    // Assuming the base URL is for accessing the image (not the local storage path)
    const imageBaseUrl = process.env.Offer_Image_Destination.replace('/home/farseit1/public_html', 'https://farseit.com');
    const imageUrl = `${imageBaseUrl}${file.filename}`;
  
    // Make sure the Details is parsed as a JSON object
    const detailsObject = JSON.parse(body.Details);
    console.log(detailsObject)
  
    const data = {
      name: body.name,
      description: body.description,
      image: imageUrl,
      Details: detailsObject, // This will store it as an object in the database
    };
    console.log(data.Details)
  
    return this.offerService.createOffer(data);
  }
  
  
  

  @Get()
  async getAllOffers(): Promise<OfferEntity[]> {
    return this.offerService.getAllOffers();
  }

  @Get(':id')
  async getOfferById(@Param('id') id: number): Promise<OfferEntity> {
    return this.offerService.getOfferById(id);
  }

  @Put(':id')
  async updateOffer(@Param('id') id: number, @Body() body: Partial<OfferEntity>): Promise<OfferEntity> {
    return this.offerService.updateOffer(id, body);
  }

  @Delete(':id')
  async deleteOffer(@Param('id') id: number): Promise<{ message: string; success: boolean }> {
    return this.offerService.deleteOffer(id);
  }
}
