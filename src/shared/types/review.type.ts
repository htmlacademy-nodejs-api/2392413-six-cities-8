import { UserInfo } from './user-info.type.js';

export type Review = {
  id: string;
  date: Date;
  user: UserInfo;
  comment: string;
  rating: number;
};
