import { RequestBody } from '#src/shared/libs/rest/types/request-body.type.js';
import { RequestParams } from '#src/shared/libs/rest/types/request.params.type.js';
import { Request } from 'express';
import { CreateOfferDto } from './dto/create-offer-dto.js';

export type CreateOfferRequest = Request<
  RequestParams,
  RequestBody,
  CreateOfferDto
>;
