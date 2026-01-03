
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Member from '../models/Member';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const member = await Member.findById(req.user?.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    return res.status(200).json({ success: true, data: member });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, mobile } = req.body;
    
    // Check if new email/mobile is already taken
    if (email) {
      const existing = await Member.findOne({ email, _id: { $ne: req.user?.id } });
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.user?.id,
      { $set: { name, email, mobile } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedMember
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};
