// domain/entities/IUser.ts (if not already declared)
export type UserRole = 'admin' | 'vendor' | 'customer';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  timezone?:string;
  isBlocked?: boolean;
}
