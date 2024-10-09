import { getErrorMessage } from '#helpers/common.js';
import { getMongoURI } from '#helpers/database.js';
import { DatabaseClient } from '#libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '#libs/database-client/mongo-database-client.js';
import { TSVFileReader } from '#libs/file-reader/tsv-file-reader.js';
import { ConsoleLogger } from '#libs/logger/console-logger.js';
import { Logger } from '#libs/logger/logger.interface.js';
import { DefaultOfferService } from '#modules/offer/default-offer-service.js';
import { OfferModel } from '#modules/offer/offer-entity.js';
import { OfferService } from '#modules/offer/offer-service.interface.js';
import { ReviewModel } from '#modules/review/review-entity.js';
import { DefaultUserService } from '#modules/user/default-user-service.js';
import { UserModel } from '#modules/user/user-entity.js';
import { UserService } from '#modules/user/user-service.interface.js';
import { Offer } from '#types/offer.type.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(
      this.logger,
      OfferModel,
      ReviewModel
    );
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate(
      {
        ...offer.host,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt
    );

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      createdDate: offer.createdDate,
      city: offer.city.name,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      goods: offer.goods,
      userId: user.id,
      location: offer.location,
    });
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
