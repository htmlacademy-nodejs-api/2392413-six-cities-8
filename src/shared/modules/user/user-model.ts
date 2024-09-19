import { Document, model, Schema } from 'mongoose';
import { User } from '../../types/index.js';

export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 15;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 12;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      minlength: [MIN_NAME_LENGTH, `Min length for name is ${MIN_NAME_LENGTH}`],
      maxlength: [MAX_NAME_LENGTH, `Max length for name is ${MAX_NAME_LENGTH}`],
    },
    email: {
      type: String,
      match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
      unique: true,
      require: true,
    },
    avatarUrl: String,
    password: {
      type: String,
      require: true,
      minlength: [
        MIN_PASSWORD_LENGTH,
        `Min length for password is ${MIN_PASSWORD_LENGTH}`,
      ],
      maxlength: [
        MAX_PASSWORD_LENGTH,
        `Max length for password is ${MAX_PASSWORD_LENGTH}`,
      ],
    },
    isPro: { type: Boolean, require: true },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>('User', userSchema);
