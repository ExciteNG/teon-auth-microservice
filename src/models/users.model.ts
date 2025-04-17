import { stat } from 'fs';
import mongoose, { model, models, Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  apps?: Apps[];
  phoneNumber?: string;
  username?: string;
  gender: string;
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
    phoneNumber: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true },
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
    gender: { type: String, required: true },
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
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);
export default User;
