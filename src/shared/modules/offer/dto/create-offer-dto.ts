import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { GoodType } from '../../../../../src/shared/types/good-type.type.js';
import { Location } from '../../../../../src/shared/types/location.type.js';
import { OfferType } from '../../../../../src/shared/types/offer-type.enum.js';
import {
  IMAGES_COUNT,
  MAX_ADULTS_COUNT,
  MAX_BEDROOMS_COUNT,
  MAX_DESCRIPTION_LENGTH,
  MAX_PRICE,
  MAX_TITLE_LENGTH,
  MIN_ADULTS_COUNT,
  MIN_BEDROOMS_COUNT,
  MIN_DESCRIPTION_LENGTH,
  MIN_PRICE,
  MIN_TITLE_LENGTH,
} from '../offer.constant.js';
import { CityDto } from './city-dto.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @MinLength(MIN_TITLE_LENGTH, {
    message: CreateOfferValidationMessage.title.minLength,
  })
  @MaxLength(MAX_TITLE_LENGTH, {
    message: CreateOfferValidationMessage.title.maxLength,
  })
  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  public title: string;

  @MinLength(MIN_DESCRIPTION_LENGTH, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(MAX_DESCRIPTION_LENGTH, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description: string;

  public createdDate: Date;

  @ValidateNested()
  @Type(() => CityDto)
  public city: CityDto;

  @IsString({
    message: CreateOfferValidationMessage.previewImage.invalidFormat,
  })
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: CreateOfferValidationMessage.previewImage.invalidFormat }
  )
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(IMAGES_COUNT, {
    message: CreateOfferValidationMessage.images.length,
  })
  @ArrayMaxSize(IMAGES_COUNT, {
    message: CreateOfferValidationMessage.images.length,
  })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  public rating: number;

  @IsEnum(OfferType, { message: CreateOfferValidationMessage.type.invalid })
  public type: OfferType;

  @IsInt({ message: CreateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(MIN_BEDROOMS_COUNT, {
    message: CreateOfferValidationMessage.bedrooms.minValue,
  })
  @Max(MAX_BEDROOMS_COUNT, {
    message: CreateOfferValidationMessage.bedrooms.maxValue,
  })
  public bedrooms: number;

  @IsInt({ message: CreateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(MIN_ADULTS_COUNT, {
    message: CreateOfferValidationMessage.maxAdults.minValue,
  })
  @Max(MAX_ADULTS_COUNT, {
    message: CreateOfferValidationMessage.maxAdults.maxValue,
  })
  public maxAdults: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(MIN_PRICE, { message: CreateOfferValidationMessage.price.minValue })
  @Max(MAX_PRICE, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  public goods: GoodType[];

  public userId: string;

  @IsObject({ message: CreateOfferValidationMessage.location.invalidFormat })
  public location: Location;
}
