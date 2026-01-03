
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Add cookies and body to the AuthRequest interface to ensure TypeScript recognizes them
// as they are populated by cookie-parser and body-parser/express.json() middleware.
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

  // Fix: Property 'cookies' does not exist on type 'AuthRequest'.
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
