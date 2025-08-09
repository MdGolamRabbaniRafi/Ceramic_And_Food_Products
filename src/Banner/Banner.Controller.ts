import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { BannerEntity } from './Banner.entity';
import { BannerService } from './Banner.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Banner')
@Controller('Banner')
export class BannerController {
  constructor(private readonly BannerService: BannerService) {}

  @Get()
  getHello(): string {
    return this.BannerService.getHello();
  }

  @Get('/search/:id')
  async getBanners(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.BannerService.findById(id);
  }

  @Post('/add')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let urlPath = process.env.Banner_Image_Destination;

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
  async add(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<BannerEntity> {
    const eventLink = req.body.EventLink; // Single event link
    let imageUrl = process.env.Banner_Image_Destination;
    imageUrl = `${imageUrl}${file.filename}`;

    const trimmedPath = imageUrl.replace(process.env.Host_path, '');
    const isProduction = process.env.NODE_ENV === 'production';
    let finalUrl: string;
    if (isProduction) {
      finalUrl = `${process.env.Host_url}${trimmedPath}`;
    } else {
      finalUrl = trimmedPath;
    }
    const Image = finalUrl;
    // }
    console.log('imageUrl', imageUrl);

    const bannerData = {
      fileName: file.filename,
      path: Image,
      eventLink: eventLink, // Link the file with the event link
    };

    return await this.BannerService.addSingle(bannerData);
  }

  @Get('/count')
  async countBanners(): Promise<number> {
    return await this.BannerService.countBanners();
  }

  @Get('/all')
  async getAllBanners(): Promise<any> {
    return await this.BannerService.getAll();
  }

  @Put('/edit/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let urlPath = process.env.Banner_Image_Destination;

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
  async editBanner(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('EventLink') eventLink: string,
  ): Promise<{ message: string; banner?: BannerEntity }> {
    let imageUrl = process.env.Banner_Image_Destination;
    imageUrl = `${imageUrl}${file.filename}`;
    const trimmedPath = imageUrl.replace(process.env.Host_path, '');
    const isProduction = process.env.NODE_ENV === 'production';
    let finalUrl: string;
    if (isProduction) {
      finalUrl = `${process.env.Host_url}${trimmedPath}`;
    } else {
      finalUrl = trimmedPath;
    }
    const Image = finalUrl;
    const updatedBannerData = {
      fileName: file ? file.filename : null,
      path: file ? Image : null,
      eventLink,
    };

    return await this.BannerService.editBanner(id, updatedBannerData);
  }

  @Delete('/delete/:id')
  async deleteBanner(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.BannerService.deleteBanner(id);

      if (result) {
        return res
          .status(200)
          .json({ success: true, message: 'Banner deleted successfully' });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Banner not found or deletion failed',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred during deletion',
        error: error.message,
      });
    }
  }

  @Delete('/forcefullyDelete/:id')
  async forcefullyDelete(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.BannerService.forcefullyDelete(id);

      if (result) {
        return res
          .status(200)
          .json({ success: true, message: 'Banner deleted successfully' });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Banner not found or deletion failed',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred during deletion',
        error: error.message,
      });
    }
  }
}
