import { RequestBody } from '#shared/libs/rest/types/request-body.type.js';
import { RequestParams } from '#shared/libs/rest/types/request.params.type.js';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user-dto.js';

export type CreateUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto
>;
