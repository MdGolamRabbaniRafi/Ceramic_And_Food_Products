import { OfferEntity } from './Offer.entity';
import { OfferService } from './Offer.service';
export declare class OfferController {
    private readonly offerService;
    constructor(offerService: OfferService);
    createOffer(file: Express.Multer.File, body: any): Promise<OfferEntity>;
    getAllOffers(): Promise<OfferEntity[]>;
    getOfferById(id: number): Promise<OfferEntity | {
        message: string;
    }>;
    updateOffer(file: Express.Multer.File, id: number, body: Partial<OfferEntity>): Promise<OfferEntity | {
        message: string;
    }>;
    deleteOffer(id: number): Promise<{
        message: string;
        success: boolean;
    }>;
}
