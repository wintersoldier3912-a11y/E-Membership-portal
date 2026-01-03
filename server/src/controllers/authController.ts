
import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Member from '../models/Member';

const OTP_EXPIRY_MINS = 5;
const MAX_ATTEMPTS = 5;

const hashOTP = (otp: string, identifier: string) => {
  return crypto
    .createHmac('sha256', process.env.OTP_SECRET!)
    .update(`${identifier}:${otp}`)
    .digest('hex');
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile, email, method } = req.body;
    const identifier = method === 'sms' ? mobile : email;

    if (!identifier) {
      return res.status(400).json({ success: false, message: `${method === 'sms' ? 'Mobile' : 'Email'} is required` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINS * 60000);
    const otpHash = hashOTP(otp, identifier);

    const query = method === 'sms' ? { mobile } : { email };
    await Member.findOneAndUpdate(
      query,
      {
        otpHash,
        otpExpiry: expiresAt,
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    if (method === 'sms') {
      if (process.env.NODE_ENV === 'production') {
        await axios.get('https://www.fast2sms.com/dev/bulkV2', {
          params: {
            authorization: process.env.FAST2SMS_API_KEY,
            route: 'otp',
            variables_values: otp,
            numbers: mobile,
          },
        });
      } else {
        console.log(`[DEV MODE] SMS OTP for ${mobile}: ${otp}`);
      }
    } else {
      // Email logic (Simulated)
      if (process.env.NODE_ENV === 'production') {
        // Here you would use nodemailer
        console.log(`[PROD] Email OTP sent to ${email} (requires nodemailer setup)`);
      } else {
        console.log(`[DEV MODE] Email OTP for ${email}: ${otp}`);
      }
    }

    return res.status(200).json({ success: true, message: `OTP sent via ${method.toUpperCase()}` });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { mobile, email, otp, method } = req.body;
    const identifier = method === 'sms' ? mobile : email;

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP required' });
    }

    const query = method === 'sms' ? { mobile } : { email };
    const member = await Member.findOne(query).select('+otpHash +otpExpiry');

    if (!member || !member.otpHash || !member.otpExpiry) {
      return res.status(404).json({ success: false, message: 'OTP session not found' });
    }

    if (new Date() > member.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (member.attempts >= MAX_ATTEMPTS) {
      return res.status(403).json({ success: false, message: 'Too many attempts. Request new OTP.' });
    }

    const currentHash = hashOTP(otp, identifier);
    if (currentHash !== member.otpHash) {
      member.attempts += 1;
      await member.save();
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    member.otpHash = undefined;
    member.otpExpiry = undefined;
    member.attempts = 0;
    member.isVerified = true;
    await member.save();

    const token = jwt.sign(
      { id: member._id, mobile: member.mobile, email: member.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return res.status(200).json({
      success: true,
      message: 'Verified successfully',
      user: {
        id: member._id,
        mobile: member.mobile,
        email: member.email,
        name: member.name,
        isVerified: member.isVerified,
        createdAt: member.createdAt,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
