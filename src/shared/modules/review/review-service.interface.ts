import { DocumentType } from '@typegoose/typegoose';
import { CreateReviewDto } from './dto/create-review-dto.js';
import { ReviewEntity } from './review-entity.js';

export type ReviewEntityDocument = DocumentType<ReviewEntity>;

export interface ReviewService {
  create(offerId: string, dto: CreateReviewDto): Promise<ReviewEntityDocument>;
  findByOfferId(offerId: string): Promise<ReviewEntityDocument | null>;
}
