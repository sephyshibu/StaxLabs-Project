import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'vendor' | 'customer';
    [key: string]: any;
  };
}
