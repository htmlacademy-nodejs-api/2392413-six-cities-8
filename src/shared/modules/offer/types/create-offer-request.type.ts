import { CreateOfferDto } from '#modules/offer/dto/create-offer-dto.js';
import { RequestBody } from '#src/shared/libs/rest/types/request-body.type.js';
import { RequestParams } from '#src/shared/libs/rest/types/request.params.type.js';
import { Request } from 'express';

export type CreateOfferRequest = Request<
  RequestParams,
  RequestBody,
  CreateOfferDto
>;
