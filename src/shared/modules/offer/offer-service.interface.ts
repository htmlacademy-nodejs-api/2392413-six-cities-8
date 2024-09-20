import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { OfferEntity } from './offer-entity.js';

export type OfferEntityDocument = DocumentType<OfferEntity>;

export interface OfferService {
  create(dto: CreateOfferDto): Promise<OfferEntityDocument>;
  findById(offerId: string): Promise<OfferEntityDocument | null>;
}
