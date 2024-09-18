import { readFileSync } from 'node:fs';
import { usersMock } from '../../../../mocks/users.js';
import { Cities } from '../../const.js';
import {
  City,
  GoodType,
  Location,
  Offer,
  OfferType,
  UserInfo,
} from '../../types/index.js';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      id,
      title,
      description,
      createdDate,
      cityName,
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
      hostName,
      latitude,
      longitude,
    ] = line.split('\t');

    return {
      id,
      title,
      type: type as OfferType,
      price: Number.parseInt(price, 10),
      city: this.parseCity(cityName),
      location: this.parseLocation(latitude, longitude),
      isFavorite: this.parseBooleanField(isFavorite),
      isPremium: this.parseBooleanField(isPremium),
      rating: Number.parseFloat(rating),
      description,
      bedrooms: Number.parseInt(bedrooms, 10),
      goods: this.parseGoods(goods),
      host: this.parseUser(hostName),
      images: this.parseImages(images),
      previewImage,
      maxAdults: Number.parseInt(maxAdults, 10),
      createdDate: new Date(createdDate),
    };
  }

  private parseGoods(goodsString: string): GoodType[] {
    return goodsString.split(';').map((good) => good as GoodType);
  }

  private parseImages(imageString: string): string[] {
    return imageString.split(';');
  }

  private parseBooleanField(value: string): boolean {
    return value === 'true';
  }

  private parseLocation(latitude: string, longitude: string): Location {
    return {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    };
  }

  private parseCity(cityName: string): City {
    const cityIndex = Cities.findIndex((city) => city.name === cityName);
    if (cityIndex === -1) {
      throw new Error(`City "${cityName}" not found`);
    }
    return Cities[cityIndex];
  }

  private parseUser(username: string): UserInfo {
    const userIndex = usersMock.findIndex((user) => user.name === username);
    if (userIndex === -1) {
      throw new Error(`User "${username}" not found in mock data`);
    }
    return usersMock[userIndex];
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
