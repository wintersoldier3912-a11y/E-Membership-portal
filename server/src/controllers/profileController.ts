
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Profile from '../models/Profile';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = req.user?.id;
    // Find or create profile (Lazy Initialization)
    let profile = await Profile.findOne({ memberId });
    
    if (!profile) {
      profile = await Profile.create({ 
        memberId,
        preferredAuthMethod: 'sms',
        preferences: {
          marketingEmails: false,
          smsNotifications: true
        }
      });
    }
    
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = req.user?.id;
    const { name, email, bio, avatarUrl, preferredAuthMethod, preferences } = req.body;
    
    // Simple validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({ success: false, message: 'Bio is too long (max 500 chars)' });
    }

    // Security check: ensure email uniqueness if provided
    if (email) {
      const existing = await Profile.findOne({ email, memberId: { $ne: memberId } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email address already in use' });
      }
    }

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (preferredAuthMethod !== undefined) updateData.preferredAuthMethod = preferredAuthMethod;
    
    if (preferences) {
      if (preferences.marketingEmails !== undefined) {
        updateData['preferences.marketingEmails'] = preferences.marketingEmails;
      }
      if (preferences.smsNotifications !== undefined) {
        updateData['preferences.smsNotifications'] = preferences.smsNotifications;
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { memberId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};
