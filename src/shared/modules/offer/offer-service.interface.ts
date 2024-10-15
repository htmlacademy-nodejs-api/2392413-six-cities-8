import { CityName } from '#src/shared/types/city-name.enum.js';
import { DocumentExists } from '#src/shared/types/document-exists.interface.js';
import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { UpdateOfferDto } from './dto/update-offer-dto.js';
import { OfferEntity } from './offer-entity.js';

export type OfferEntityDocument = DocumentType<OfferEntity>;
export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<OfferEntityDocument>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<OfferEntityDocument | null>;
  deleteById(offerId: string): Promise<OfferEntityDocument | null>;
  findById(offerId: string): Promise<OfferEntityDocument | null>;
  find(): Promise<OfferEntityDocument[]>;
  findPremiumByCity(cityName: CityName): Promise<OfferEntityDocument[] | null>;
  updateFavorite(
    userId: string,
    offerId: string,
    status: number
  ): Promise<OfferEntityDocument | null>;
  updateRating(
    offerId: string,
    rating: number
  ): Promise<OfferEntityDocument | null>;
  findFavorites(favoritesId: string[]): Promise<OfferEntityDocument[]>;
}
