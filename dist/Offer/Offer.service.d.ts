import { Repository } from 'typeorm';
import { OfferEntity } from './Offer.entity';
export declare class OfferService {
    private readonly offerRepository;
    constructor(offerRepository: Repository<OfferEntity>);
    createOffer(data: Partial<OfferEntity>): Promise<OfferEntity>;
    deleteImageFile(imagePath: string): Promise<{
        message: string;
    }>;
    getAllOffers(): Promise<OfferEntity[]>;
    getOfferById(id: number): Promise<OfferEntity | {
        message: string;
    }>;
    updateOffer(id: number, data: Partial<OfferEntity>): Promise<OfferEntity | {
        message: string;
    }>;
    deleteOffer(id: number): Promise<{
        message: string;
        success: boolean;
    }>;
    forceullyDelete(id: number): Promise<{
        message: string;
        success: boolean;
    }>;
}
