import { Response, NextFunction } from 'express';
import { ExtendedRequest } from './types/ExtendedRequest';

export const roleGuard = (roles: string[]) => {
  return async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("unoaut")
      res.sendStatus(403);
      return;
    }
    next();
  };
};
