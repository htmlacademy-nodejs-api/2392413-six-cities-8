import { CityName } from '#shared/types/city-name.enum.js';
import { ParamsDictionary } from 'express-serve-static-core';

export type ParamCityName = { cityName: CityName } | ParamsDictionary;
