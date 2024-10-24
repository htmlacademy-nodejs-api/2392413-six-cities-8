import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  DECIMAL_RATING,
  MAX_COMMENT_LENGTH,
  MAX_RATING,
  MIN_COMMENT_LENGTH,
  MIN_RATING,
} from '../review.constant.js';
import { CreateReviewValidationMessage } from './create-review-messages.js';

export class CreateReviewDto {
  public offerId: string;

  public userId: string;

  @MinLength(MIN_COMMENT_LENGTH, {
    message: CreateReviewValidationMessage.comment.minLength,
  })
  @MaxLength(MAX_COMMENT_LENGTH, {
    message: CreateReviewValidationMessage.comment.maxLength,
  })
  @IsString({ message: CreateReviewValidationMessage.comment.invalidFormat })
  public comment: string;

  @IsNumber(
    { maxDecimalPlaces: DECIMAL_RATING },
    { message: CreateReviewValidationMessage.rating.invalidFormat }
  )
  @Min(MIN_RATING, { message: CreateReviewValidationMessage.rating.minValue })
  @Max(MAX_RATING, { message: CreateReviewValidationMessage.rating.maxValue })
  public rating: number;
}
