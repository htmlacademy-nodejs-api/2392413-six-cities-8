import { Request } from 'express';
import { RequestBody } from '../../../../src/shared/libs/rest/types/request-body.type.js';
import { RequestParams } from '../../../../src/shared/libs/rest/types/request.params.type.js';
import { CreateUserDto } from './dto/create-user-dto.js';

export type CreateUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto
>;
