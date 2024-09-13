import { User } from './user.type.js';

export type UserInfo = Omit<User, 'id' | 'password' | 'email'>;
