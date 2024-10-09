import { ParamsDictionary } from 'express-serve-static-core';

export type ParamUpdateFavorite =
  | { offerId: string; status: number }
  | ParamsDictionary;
