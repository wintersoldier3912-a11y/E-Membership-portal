
import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  mobile?: string;
  email?: string;
  name?: string;
  otpHash?: string;
  otpExpiry?: Date;
  attempts: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema(
  {
    mobile: {
      type: String,
      unique: true,
      sparse: true, // Allows nulls for users who only use email
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    otpHash: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMember>('Member', MemberSchema);
