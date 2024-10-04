import { RequestBody } from '#src/shared/libs/rest/types/request-body.type.js';
import { RequestParams } from '#src/shared/libs/rest/types/request.params.type.js';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user-dto.js';

export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;
