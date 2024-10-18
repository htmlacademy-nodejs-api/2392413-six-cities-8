import { CityName } from '#src/shared/types/city-name.enum.js';
import { City } from '#src/shared/types/city.type.js';
import { Location } from '#src/shared/types/location.type.js';
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
