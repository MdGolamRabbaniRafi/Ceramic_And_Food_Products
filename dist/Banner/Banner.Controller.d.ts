import { Response } from 'express';
import { BannerEntity } from './Banner.entity';
import { BannerService } from './Banner.service';
export declare class BannerController {
    private readonly BannerService;
    constructor(BannerService: BannerService);
    getHello(): string;
    getBanners(id: number): Promise<any>;
    add(file: Express.Multer.File, req: any): Promise<BannerEntity>;
    countBanners(): Promise<number>;
    getAllBanners(): Promise<any>;
    editBanner(id: number, file: Express.Multer.File, eventLink: string): Promise<{
        message: string;
        banner?: BannerEntity;
    }>;
    deleteBanner(id: number, res: Response): Promise<any>;
    forcefullyDelete(id: number, res: Response): Promise<any>;
}
