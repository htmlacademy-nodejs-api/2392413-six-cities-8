export const CreateReviewValidationMessage = {
  comment: {
    minLength: 'Minimum comment length must be 5',
    maxLength: 'Maximum comment length must be 1024',
    invalidFormat: 'Title must be a string',
  },
  date: {
    invalidFormat: 'Date must be a valid ISO date',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  rating: {
    invalidFormat: 'Rating must be an number',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
};
