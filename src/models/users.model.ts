import { stat } from 'fs';
import mongoose, { model, models, Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: {
    firstName: string;
    lastName: string;
    fullName?: string;
  };
  bio?: string;
  apps?: Apps[];
  phoneNumber?: string;
  username?: string;
  gender?: string;
  credit?: number;
  email: string;
  status?: string;
  password: string;
  profileImage?: string;
  language?: string;
  country?: string;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  confirmationCode: string;
  verificationToken: string;
  verificationTokenExpiry: Date;
}

interface Apps {
  name: string;
  status?: string;
  userType: string;
}

const userSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
    },
    name: {
      firstName: { type: String },
      lastName: { type: String },
    },
    username: { type: String, unique: true },
    bio: { type: String },
    apps: [
      {
        name: { type: String },
        userType: { type: String },
        status: { type: String },
      },
    ],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    gender: { type: String },
    credit: { type: Number },
    language: { type: String },
    country: { type: String },
    status: { type: String, default: 'active' },
    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    confirmationCode: { type: String },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
  },
  { timestamps: true, discriminatorKey: 'userType' }
);

const User = model<IUser>('User', userSchema);
export default User;
