import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface ExtendedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'vendor' | 'customer';
  };
}

export const authenticateJWT = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  const userIdHeader = req.headers['x-user-id'];

  if (!token) {
    res.sendStatus(401);
    console.log("asd",1)
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === 'string') {
      console.log("asd",2)
      res.sendStatus(403);
      return;
    }

    const { id, role } = decoded as JwtPayload;

    if (!id || !role) {
      console.log("asd",3)
      res.sendStatus(403);
      return;
    }

    req.user = {
      id: userIdHeader && typeof userIdHeader === 'string' ? userIdHeader : id,
      role,
    };

    next();
  } catch (err) {
    console.log("asd",4)
    res.sendStatus(403);
    return;
  }
};
