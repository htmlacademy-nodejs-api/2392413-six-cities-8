import { User } from './index.js';

export type Review = {
  id: string;
  date: Date;
  user: User;
  comment: string;
  rating: number;
};
