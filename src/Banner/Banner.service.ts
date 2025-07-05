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
  ) {}
  getHello(): string {
    return 'Hello Banner!';
  }

  async findById(id: number): Promise<BannerEntity | null> {
    const bannerEntity = await this.BannerRepo.findOne({ where: { Id: id } });

    if (bannerEntity != null && typeof bannerEntity.path === 'string') {
      const trimmed = bannerEntity.path.trim();
      const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
      bannerEntity.path = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
    }

    return bannerEntity;
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
  async addSingle(bannerData: {
    fileName: string;
    path: string;
    eventLink: string;
  }): Promise<BannerEntity> {
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

    const updatedResponse = response.map((item) => {
      const trimmed = item.path.trim();
      const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
      const finalPath = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;

      return {
        ...item,
        path: finalPath,
      };
    });

    return updatedResponse;
  }

  async deleteImageFile(imagePath: string): Promise<{ message: string }> {
    if (!imagePath) {
      return { message: 'No image path provided' };
    }

    // Normalize incorrect slashes
    if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
      imagePath = imagePath.replace('https:/', 'https://');
    }

    // Extract filename from URL
    const fileName = path.basename(imagePath);
    console.log('basename:', fileName);

    // Determine environment
    const isProduction =
      process.env.NODE_ENV === 'production' || process.platform !== 'win32';

    // Get upload path from .env
    let uploadDir = process.env.Banner_Image_Destination || '';

    // If in production and image path starts with Host_url, convert URL to local path
    if (
      isProduction &&
      process.env.Host_url &&
      imagePath.startsWith(process.env.Host_url)
    ) {
      uploadDir = process.env.Host_path
        ? path.join(
            process.env.Host_path,
            uploadDir.replace(process.env.Host_path, ''),
          )
        : uploadDir;
    }

    // Construct local file path
    const localImagePath = path.join(uploadDir, fileName);
    console.log('Resolved path for deletion:', localImagePath);

    // Check if file exists
    try {
      await fs.access(localImagePath);
    } catch (err) {
      console.error('File not found:', localImagePath);
      return { message: 'File not found' };
    }

    // Attempt deletion
    try {
      await fs.unlink(localImagePath);
      console.log('File deleted:', fileName);
      return { message: 'File deleted successfully' };
    } catch (err) {
      console.error('Failed to delete:', localImagePath, err);
      return { message: 'Failed to delete file' };
    }
  }

  async editBanner(
    id: number,
    updatedData: { fileName?: string; path?: string; eventLink?: string },
  ): Promise<{ message: string; banner?: BannerEntity }> {
    const banner = await this.findById(id);
    if (!banner) {
      return { message: 'Banner not found' };
    }

    if (updatedData.fileName && updatedData.path) {
      const oldFilePath = banner.path;
      const deleteFile = await this.deleteImageFile(oldFilePath);

      // ✅ Only continue if old image was successfully deleted
      if (deleteFile.message !== 'File deleted successfully') {
        return deleteFile;
      }

      banner.FileName = updatedData.fileName;
      banner.path = updatedData.path;

      if (updatedData.eventLink) {
        banner.EventLink = updatedData.eventLink;
      }

      const updatedBanner = await this.BannerRepo.save(banner);
      return { message: 'Banner updated successfully', banner: updatedBanner };
    }

    return { message: 'File data not provided' };
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

  async forcefullyDelete(id: number): Promise<boolean> {
    const banner = await this.findById(id);
    if (!banner) {
      throw new Error('Banner not found');
    }

    // Delete the associated image file

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
