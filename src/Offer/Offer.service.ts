import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferEntity } from './Offer.entity';
import { promises as fs } from 'fs';
import * as path from 'path';
import { normalize } from 'path';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offerRepository: Repository<OfferEntity>,
  ) {}

  async createOffer(data: Partial<OfferEntity>): Promise<OfferEntity> {
    const offer = this.offerRepository.create(data);
    return await this.offerRepository.save(offer);
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
    // console.log("basename:", fileName);

    // Determine environment
    const isProduction =
      process.env.NODE_ENV === 'production' || process.platform !== 'win32';

    // Get upload path from .env
    let uploadDir = process.env.Offer_Image_Destination || '';

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
    // console.log("Resolved path for deletion:", localImagePath);

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

  async getAllOffers(): Promise<OfferEntity[]> {
    const offers = await this.offerRepository.find();

    const updatedOffers = offers.map((offer) => {
      if (typeof offer.image === 'string') {
        const trimmed = offer.image.trim();
        const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
        offer.image = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
      }

      return offer;
    });

    return updatedOffers;
  }

  async getOfferById(id: number): Promise<OfferEntity | { message: string }> {
    const offer = await this.offerRepository.findOne({ where: { id } });

    if (!offer) {
      return { message: 'Not found' };
    }

    // Clean up image path if it's a string
    if (typeof offer.image === 'string') {
      const trimmed = offer.image.trim();
      const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
      offer.image = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
    }

    return offer;
  }

  async updateOffer(
    id: number,
    data: Partial<OfferEntity>,
  ): Promise<OfferEntity | { message: string }> {
    if (data.image !== undefined) {
      const offer = await this.getOfferById(id);

      if ('message' in offer) {
        return offer;
      }

      const check = await this.deleteImageFile(offer.image);
      if (check.message != 'File deleted successfully') {
        return { message: check.message };
      }
    }

    await this.offerRepository.update(id, data);
    return await this.getOfferById(id);
  }

  async deleteOffer(
    id: number,
  ): Promise<{ message: string; success: boolean }> {
    const offer = await this.getOfferById(id);

    if ('message' in offer) {
      return { message: offer.message, success: false };
    }

    if (offer.image) {
      const check = await this.deleteImageFile(offer.image);
      if (check.message != 'File deleted successfully') {
        return { message: check.message, success: false };
      }
    }

    try {
      await this.offerRepository.delete(id);
      return {
        message: `Offer with ID ${id} deleted successfully.`,
        success: true,
      };
    } catch (error) {
      return { message: 'Error removing offer', success: false };
    }
  }

  async forceullyDelete(
    id: number,
  ): Promise<{ message: string; success: boolean }> {
    const offer = await this.getOfferById(id);

    if ('message' in offer) {
      return { message: offer.message, success: false };
    }

    // if (offer.image) {
    //   const check = await this.deleteImageFile(offer.image);
    //   if (check.message != 'File deleted successfully') {
    //     return { message: check.message, success: false };
    //   }
    // }

    try {
      await this.offerRepository.delete(id);
      return {
        message: `Offer with ID ${id} deleted successfully.`,
        success: true,
      };
    } catch (error) {
      return { message: 'Error removing offer', success: false };
    }
  }
}
