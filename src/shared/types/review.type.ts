import { UserInfo } from './index.js';

export type Review = {
  id: string;
  date: Date;
  user: UserInfo;
  comment: string;
  rating: number;
};
