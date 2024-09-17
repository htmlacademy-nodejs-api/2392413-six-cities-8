import { GoodType } from './good-type.type.js';
import { UserInfo } from './user-info.type.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  goods: GoodType[];
  users: UserInfo[];
};
