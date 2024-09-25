import { User } from './user.type.js';

export type Review = {
  date: Date;
  user: User;
  comment: string;
  rating: number;
};
