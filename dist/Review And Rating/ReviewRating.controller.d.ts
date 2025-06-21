import { ReviewRatingEntity } from './ReviewRating.entity';
import { ReviewRatingService } from './ReviewRating.service';
export declare class ReviewRatingController {
    private readonly ReviewRatingService;
    constructor(ReviewRatingService: ReviewRatingService);
    getHello(): string;
    addReviewRating(ReviewRatingData: ReviewRatingEntity): Promise<boolean | any>;
    SearchByUserID(userId: number, productId: number): Promise<any>;
    SearchByProductID(productId: number): Promise<any>;
    update(userId: number, productId: number, updateData: ReviewRatingEntity): Promise<any>;
    averageRating(productId: number): Promise<any>;
    DeleteByUserID(userId: number, productId: number): Promise<any>;
}
