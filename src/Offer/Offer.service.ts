import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferEntity } from './Offer.entity';
import * as path from 'path'; // Ensure this is imported
import * as fs from 'fs';

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
  async deleteImageFile(imagePath: string): Promise<boolean> {
    // Log the received imagePath to see if it is already altered
    console.log("check1")
    if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
      imagePath = imagePath.replace('https:/', 'https://');
    }
    console.log("check2")

    let localImagePath: string = imagePath;
  
    // Check for production environment and transform URL to local path
    if (process.env.NODE_ENV === 'production') {
      // Ensure imagePath starts with 'https://farseit.com/Upload' before replacing it
      if (imagePath.startsWith('https://farseit.com/Upload')) {
        localImagePath = imagePath.replace('https://farseit.com/Upload', '/home/farseit1/public_html/Upload');
      } else {
        return false; // If path doesn't match, return false
      }
    }
    console.log("check3")
    console.log(localImagePath);

    // Resolve the absolute file path for the localImagePath
    const resolvedPath = path.resolve(localImagePath);
    console.log("check4")

    try {
      // Attempt to delete the image file from the server
      await fs.promises.unlink(resolvedPath); // Use promises for async handling
      console.log(`Successfully deleted image: ${resolvedPath}`);
      return true; // Return true on successful deletion
    } catch (err) {
      console.error(`Failed to delete image: ${resolvedPath}`, err);
      return false; // Return false if deletion fails
    }
  }
  
  async getAllOffers(): Promise<OfferEntity[]> {
    const offers = await this.offerRepository.find();
    
    // Replace image paths for each offer
    offers.forEach(offer => {
      if (offer.image) { // Assuming `imagePath` is the field where the path is stored
        offer.image = this.replaceImagePath(offer.image);
      }
    });
  
    return offers;
  }
  
   replaceImagePath(imgPath: string): string {
    return imgPath.replace('$', '').replace('/home/farseit1/public_html', 'https://farseit.com');
  }
  

  async getOfferById(id: number): Promise<OfferEntity> {
    const offer= await this.offerRepository.findOne({ where: { id } });
    offer.image=this.replaceImagePath(offer.image);
    return offer;
  }

  async updateOffer(id: number, data: Partial<OfferEntity>): Promise<OfferEntity> {
    await this.offerRepository.update(id, data);
    return this.getOfferById(id);
  }

  async deleteOffer(id: number): Promise<{ message: string; success: boolean }> {
    const offer = await this.offerRepository.findOne({ where: { id: id } });
  
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }
  
    // Check if image exists and delete it
    if (offer.image) {
      const check = await this.deleteImageFile(offer.image);
      if(!check)
      {
        return{message:'Error removing Offer Image', success:false}
      }
    }
  
    try {
      // Delete the offer using the id
      await this.offerRepository.delete(id); 
      console.log(`Offer with ID ${id} deleted successfully.`);
      
      // Return a success message with boolean
      return { message: `Offer with ID ${id} deleted successfully.`, success: true };
    } catch (error) {
      console.error('Error removing offer:', error.message);
      
      // Return an error message with boolean
      return { message: 'Error removing offer', success: false };
    }
  }
  
  
}
