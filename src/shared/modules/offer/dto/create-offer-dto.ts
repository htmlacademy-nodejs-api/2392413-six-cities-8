import { CityName } from '#src/shared/types/city-name.enum.js';
import { GoodType } from '#types/good-type.type.js';
import { Location } from '#types/location.type.js';
import { OfferType } from '#types/offer-type.enum.js';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsString,
  IsUrl,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  public title: string;

  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.createdDate.invalidFormat }
  )
  public createdDate: Date;

  @IsEnum(CityName, { message: CreateOfferValidationMessage.city.invalid })
  public city: CityName;

  @IsString({
    message: CreateOfferValidationMessage.previewImage.invalidFormat,
  })
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: CreateOfferValidationMessage.previewImage.invalidFormat }
  )
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @Length(6, 6, { message: CreateOfferValidationMessage.images.length })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite: boolean;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: CreateOfferValidationMessage.rating.invalidFormat }
  )
  @Min(1, { message: CreateOfferValidationMessage.rating.minValue })
  @Max(5, { message: CreateOfferValidationMessage.rating.maxValue })
  public rating: number;

  @IsEnum(OfferType, { message: CreateOfferValidationMessage.type.invalid })
  public type: OfferType;

  @IsInt({ message: CreateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms: number;

  @IsInt({ message: CreateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: CreateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  public goods: GoodType[];

  public userId: string;

  @IsObject({ message: CreateOfferValidationMessage.location.invalidFormat })
  public location: Location;
}
