import { User } from './index.js';

export type UserInfo = Omit<User, 'password' | 'email'>;
