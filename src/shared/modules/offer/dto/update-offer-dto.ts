import { Exclude } from 'class-transformer';
import { IsEmpty } from 'class-validator';
import { CreateOfferDto } from './create-offer-dto.js';

export class UpdateOfferDto extends CreateOfferDto {
  @Exclude()
  @IsEmpty()
  public declare userId: string;
}
