import { Repository } from 'typeorm';
import { ReviewRatingEntity } from './ReviewRating.entity';
export declare class ReviewRatingService {
    private ReviewRatingRepo;
    constructor(ReviewRatingRepo: Repository<ReviewRatingEntity>);
    getHello(): string;
    findById(id: number): Promise<ReviewRatingEntity | null>;
    SearchByProductID(ProductId: number): Promise<ReviewRatingEntity[] | null>;
    findByUserId(UserId: number, ProductId: number): Promise<ReviewRatingEntity | null>;
    DeleteByUserID(UserId: number, ProductId: number): Promise<boolean | null>;
    averageRating(ProductId: number): Promise<any>;
    update(UserId: number, ProductId: number, updateData: ReviewRatingEntity): Promise<ReviewRatingEntity | null>;
    addReviewRating(ReviewRatingEntity: ReviewRatingEntity): Promise<boolean>;
}
