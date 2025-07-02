
import { IUser } from '../../domain/model/IUser';

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findEmailById(id: string): Promise<string | null>;
  deleteById(id: string): Promise<void>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: Omit<IUser, 'id'>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  blockUser(id: string): Promise<void>;
unblockUser(id: string): Promise<void>;
  checkblockById(id: string): Promise<IUser | null>;
  findAllVendor():Promise<IUser[]>

}
