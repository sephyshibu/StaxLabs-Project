import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface ExtendedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'vendor' | 'customer';
  };
}

export const authenticateJWT = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const userIdHeader = req.headers['x-user-id'];

  if (!token) {
    console.log("🚫 No token found in Authorization header.");
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (typeof decoded !== 'object' || !decoded.id || !decoded.role) {
      console.log("🚫 Invalid token payload structure.");
     res.status(403).json({ message: 'Forbidden: Invalid token' });
     return
    }

    req.user = {
      id: typeof userIdHeader === 'string' ? userIdHeader : decoded.id,
      role: decoded.role as 'admin' | 'vendor' | 'customer',
    };

    next();
  } catch (err) {
    console.log("🚫 Token verification failed:", err);
   res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
   return
  }
};
