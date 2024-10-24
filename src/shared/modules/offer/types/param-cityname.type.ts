import { ParamsDictionary } from 'express-serve-static-core';
import { CityName } from '../../../../../src/shared/types/city-name.enum.js';

export type ParamCityName = { cityName: CityName } | ParamsDictionary;
