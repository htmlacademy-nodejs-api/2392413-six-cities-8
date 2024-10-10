export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
    invalidFormat: 'Title must be a string',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  createdDate: {
    invalidFormat: 'createdDate must be a valid ISO date',
  },
  city: {
    invalid: 'Invalid city name',
  },
  type: {
    invalid: 'type must be apartment, house, room or hotel',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000',
  },
  maxAdults: {
    invalidFormat: 'MaxAdults must be an integer',
    minValue: 'Minimum maxAdults is 1',
    maxValue: 'Maximum maxAdults is 10',
  },
  bedrooms: {
    invalidFormat: 'Bedrooms must be an integer',
    minValue: 'Minimum bedrooms is 1',
    maxValue: 'Maximum bedrooms is 8',
  },
  rating: {
    invalidFormat: 'Rating must be an number',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    length: 'Field images must contain 6 elements',
  },
  previewImage: {
    invalidFormat: 'Field previewImage must be string',
  },
  location: {
    invalidFormat: 'Field location must be object',
  },
  goods: {
    invalidFormat: 'Field goods must be an array',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  isPremium: { invalidFormat: 'Field isPremium must be boolean' },
  isFavorite: { invalidFormat: 'Field isFavorite must be boolean' },
} as const;
