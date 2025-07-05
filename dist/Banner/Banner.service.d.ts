import { Repository } from 'typeorm';
import { BannerEntity } from './Banner.entity';
export declare class BannerService {
    private BannerRepo;
    constructor(BannerRepo: Repository<BannerEntity>);
    getHello(): string;
    findById(id: number): Promise<BannerEntity | null>;
    addSingle(bannerData: {
        fileName: string;
        path: string;
        eventLink: string;
    }): Promise<BannerEntity>;
    getAll(): Promise<any[]>;
    deleteImageFile(imagePath: string): Promise<{
        message: string;
    }>;
    editBanner(id: number, updatedData: {
        fileName?: string;
        path?: string;
        eventLink?: string;
    }): Promise<{
        message: string;
        banner?: BannerEntity;
    }>;
    deleteBanner(id: number): Promise<boolean>;
    forcefullyDelete(id: number): Promise<boolean>;
    countBanners(): Promise<number>;
}
