
import { IUser } from '../../domain/model/IUser';

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  deleteById(id: string): Promise<void>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: Omit<IUser, 'id'>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  
}
