import { CityName } from '#shared/types/city-name.enum.js';
import { City } from '#shared/types/city.type.js';
import { Location } from '#shared/types/location.type.js';
import { IsString, ValidateNested } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CityDto implements City {
  @IsString({
    each: true,
    message: CreateOfferValidationMessage.city.invalid,
  })
  public name: CityName;

  @ValidateNested()
  public location: Location;
}
