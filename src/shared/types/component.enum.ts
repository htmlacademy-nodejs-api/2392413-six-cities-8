export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  OfferService: Symbol.for('OfferService'),
  OfferModel: Symbol.for('OfferModel'),
  ReviewService: Symbol.for('ReviewService'),
  ReviewModel: Symbol.for('ReviewModel'),
  UserController: Symbol.for('UserController'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
} as const;
