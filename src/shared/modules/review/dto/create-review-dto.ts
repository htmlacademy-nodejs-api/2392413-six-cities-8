import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateReviewValidationMessage } from './create-review-messages.js';

export class CreateReviewDto {
  //@IsMongoId({ message: CreateReviewValidationMessage.offerId.invalidId })
  public offerId: string;

  //@IsMongoId({ message: CreateReviewValidationMessage.userId.invalidId })
  public userId: string;

  @MinLength(10, { message: CreateReviewValidationMessage.comment.minLength })
  @MaxLength(100, { message: CreateReviewValidationMessage.comment.maxLength })
  @IsString({ message: CreateReviewValidationMessage.comment.invalidFormat })
  public comment: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: CreateReviewValidationMessage.rating.invalidFormat }
  )
  @Min(1, { message: CreateReviewValidationMessage.rating.minValue })
  @Max(5, { message: CreateReviewValidationMessage.rating.maxValue })
  public rating: number;
}
