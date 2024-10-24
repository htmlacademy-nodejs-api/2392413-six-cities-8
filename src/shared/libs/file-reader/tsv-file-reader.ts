import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { usersMock } from '../../../../mocks/users.js';
import { Cities } from '../../../../src/shared/const.js';
import { City } from '../../../../src/shared/types/city.type.js';
import { GoodType } from '../../../../src/shared/types/good-type.type.js';
import { Location } from '../../../../src/shared/types/location.type.js';
import { OfferType } from '../../../../src/shared/types/offer-type.enum.js';
import { Offer } from '../../../../src/shared/types/offer.type.js';
import { User } from '../../../../src/shared/types/user.type.js';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(private readonly filename: string) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      createdDate,
      cityName,
      previewImage,
      images,
      isPremium,
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
      title,
      type: type as OfferType,
      price: Number.parseInt(price, 10),
      city: this.parseCity(cityName),
      location: this.parseLocation(latitude, longitude),
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

  private parseUser(username: string): User {
    const userIndex = usersMock.findIndex((user) => user.name === username);
    if (userIndex === -1) {
      throw new Error(`User "${username}" not found in mock data`);
    }
    return usersMock[userIndex];
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
