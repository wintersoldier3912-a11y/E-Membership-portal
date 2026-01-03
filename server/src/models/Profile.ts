
import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  memberId: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  preferences: {
    marketingEmails: boolean;
    smsNotifications: boolean;
  };
}

const ProfileSchema: Schema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      unique: true,
    },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    bio: { type: String, trim: true, maxlength: 500 },
    avatarUrl: { type: String },
    preferences: {
      marketingEmails: { type: Boolean, default: false },
      smsNotifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema);
