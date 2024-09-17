import dayjs from 'dayjs';

import { Cities } from '../../const.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { MockServerData, OfferType } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 1;
const MAX_RATING = 5;
const FLOAT_RATING = 1;

const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 8;

const MIN_ADULTS = 1;
const MAX_ADULTS = 10;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const id = '1';
    const title = getRandomItem<string>(this.mockData.titles);
    const type = getRandomItem<string>(Object.values(OfferType));
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const city = getRandomItem(Cities);
    const latitude = (
      city.location.latitude + generateRandomValue(0, 1, 8)
    ).toString();
    const longitude = (
      city.location.longitude + generateRandomValue(0, 1, 8)
    ).toString();
    const isFavorite = 'false';
    const isPremium = getRandomItem(['false', 'true']);
    const rating = generateRandomValue(
      MIN_RATING,
      MAX_RATING,
      FLOAT_RATING
    ).toString();
    const description = getRandomItem<string>(this.mockData.descriptions);
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS).toString();
    const goods = getRandomItems<string>(this.mockData.goods).join(';');
    const host = getRandomItem<string>(this.mockData.users);
    const images = getRandomItems<string>(this.mockData.previewImages).join(
      ';'
    );
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS).toString();
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      id,
      title,
      description,
      createdDate,
      city.name,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      host,
      latitude,
      longitude,
    ].join('\t');
  }
}
