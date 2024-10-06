import { Request } from 'express';
import { UpdateOfferDto } from './dto/update-offer-dto.js';
import { ParamOfferId } from './types/param-offerId.type.js';

export type UpdateOfferRequest = Request<ParamOfferId, unknown, UpdateOfferDto>;
