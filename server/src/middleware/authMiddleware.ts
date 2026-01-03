
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Member from '../models/Member';

export interface AuthRequest extends Request {
  cookies: any;
  body: any;
  user?: {
    id: string;
    mobile?: string;
    email?: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Architect Check: Verify the member exists and is verified in the DB
    const member = await Member.findById(decoded.id);
    if (!member) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    
    if (!member.isVerified) {
      return res.status(403).json({ success: false, message: 'Account not verified' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
