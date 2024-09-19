import { Document, model, Schema } from 'mongoose';
import { User } from '../../types/index.js';

export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    avatarUrl: String,
    password: String,
    isPro: Boolean,
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>('User', userSchema);
