import { RequestBody } from '#shared/libs/rest/types/request-body.type.js';
import { RequestParams } from '#shared/libs/rest/types/request.params.type.js';
import { CreateOfferDto } from '#shared/modules/offer/dto/create-offer-dto.js';
import { Request } from 'express';

export type CreateOfferRequest = Request<
  RequestParams,
  RequestBody,
  CreateOfferDto
>;
