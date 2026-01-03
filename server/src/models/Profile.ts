
import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  memberId: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  preferredAuthMethod: 'sms' | 'email';
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
    avatarUrl: { type: String, trim: true },
    preferredAuthMethod: { 
      type: String, 
      enum: ['sms', 'email'], 
      default: 'sms' 
    },
    preferences: {
      marketingEmails: { type: Boolean, default: false },
      smsNotifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema);
