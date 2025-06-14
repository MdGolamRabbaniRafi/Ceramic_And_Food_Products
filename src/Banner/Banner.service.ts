import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from './Banner.entity';
import { unlink } from 'fs/promises';
import { promises as fs } from 'fs';
import * as path from 'path';
import { normalize } from 'path';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private BannerRepo: Repository<BannerEntity>,
  ) { }
  getHello(): string {
    return 'Hello Banner!';
  }
  async findById(id: number): Promise<BannerEntity | null> {
    let BannerEntity = await this.BannerRepo.findOne({ where: { Id: id } });
    if (BannerEntity != null) {
      return BannerEntity;
    }
    return null;
  }

  // async addMultiple(bannerData: { fileName: string; path: string; eventLink: string }[]): Promise<boolean> {
  //   // await this.removeAllFromFolder();

  //   const banners = bannerData.map(data => {
  //     const banner = new BannerEntity();
  //     banner.FileName = data.fileName;
  //     banner.path = data.path;
  //     banner.EventLink = data.eventLink; // Each file has a different event link
  //     return banner;
  //   });

  //   const savedBanners = await this.BannerRepo.save(banners);
  //   return savedBanners.length > 0;
  // }
  async addSingle(bannerData: { fileName: string; path: string; eventLink: string }): Promise<BannerEntity> {
    const banner = new BannerEntity();
    banner.FileName = bannerData.fileName;
    banner.path = bannerData.path;
    banner.EventLink = bannerData.eventLink;

    const savedBanner = await this.BannerRepo.save(banner);
    return savedBanner;
  }


  // async removeAllFromFolder(): Promise<boolean> {
  //   try {
  //     const banners = await this.BannerRepo.find();

  //     // Clear database records
  //     await this.BannerRepo.clear();

  //     // Delete files from the uploads directory
  //     for (const banner of banners) {
  //       const filePath = path.resolve(__dirname, '../../', banner.path);
  //       console.log(`Attempting to delete file: ${filePath}`);
  //       try {
  //         await fs.promises.unlink(filePath);
  //         console.log(`Deleted file: ${filePath}`);
  //       } catch (err) {
  //         console.error(`Error deleting file ${filePath}:`, err);
  //       }
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error('Error clearing Banner table:', error);
  //     return false;
  //   }
  // }

  // async removeAll(): Promise<boolean> {
  //   try {
  //     await this.BannerRepo.clear();
  //     return true;
  //   } catch (error) {
  //     console.error('Error clearing Banner table:', error);
  //     return false;
  //   }
  // }

  async getAll(): Promise<any[]> {
    const response = await this.BannerRepo.find();

    const updatedResponse = response.map(item => {
      const userImage = normalize(item.path).replace(/\\/g, '/');
      return {
        ...item,
        path: userImage
      };
    });

    return updatedResponse;
  }

  async deleteImageFile(imagePath: string): Promise<boolean> {
    if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
      imagePath = imagePath.replace('https:/', 'https://');
    }
    let localImagePath: string = imagePath;

    if (process.env.NODE_ENV === 'production') {
      if (imagePath.startsWith('https://farseit.com/Upload')) {
        localImagePath = imagePath.replace('https://farseit.com/Upload', '/home/farseit1/public_html/Upload');
      } else {
        return false;
      }
    }

    const resolvedPath = path.resolve(localImagePath);

    try {
      await fs.access(resolvedPath);
    } catch (err) {
      return false;
    }

    try {
      // Attempt to delete the image file from the server
      await fs.unlink(resolvedPath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async editBanner(id: number, updatedData: { fileName?: string; path?: string; eventLink?: string }): Promise<BannerEntity | null> {
    const banner = await this.findById(id);
    if (!banner) {
      throw new Error('Banner not found');
    }

    if (updatedData.fileName && updatedData.path) {
      const oldFilePath = banner.path;
      // try {
      const deleteFile = await this.deleteImageFile(oldFilePath);
      if (deleteFile) {

        banner.FileName = updatedData.fileName;
        banner.path = updatedData.path;


        // Update the event link if provided
        if (updatedData.eventLink) {
          banner.EventLink = updatedData.eventLink;
        }

        // Save the updated banner and return the entity
        const updatedBanner = await this.BannerRepo.save(banner);
        return updatedBanner;
      }
    }
    return null;
  }
  async deleteBanner(id: number): Promise<boolean> {
    const banner = await this.findById(id);
    if (!banner) {
      throw new Error('Banner not found');
    }

    // Delete the associated image file
    const fileDeleted = await this.deleteImageFile(banner.path);
    if (!fileDeleted) {
      console.error('Failed to delete image file:', banner.path);
      return false;
    }

    // Delete the banner from the database
    const deleteResult = await this.BannerRepo.delete(id);
    return deleteResult.affected > 0;
  }
  async countBanners(): Promise<number> {
    return await this.BannerRepo.count();
  }
  //   async serveImage(fileName: string, res: any) {
  //     const filePath = path.join(__dirname, '../../', 'uploads', fileName);
  //     res.sendFile(filePath, (err) => {
  //       if (err) {
  //         console.error('Error sending file:', err);
  //         return res.status(404).send('Image not found');
  //       }
  //     });
  //   }

}
