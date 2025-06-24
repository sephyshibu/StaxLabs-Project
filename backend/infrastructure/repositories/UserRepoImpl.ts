import {UserModel} from '../models/UserModel';
import { IUserRepository } from '../../domain/repositories/IUserrepository';
import { IUser } from '../../domain/model/IUser';

export class UserRepositoryImpl implements IUserRepository {
  async findAll(): Promise<IUser[]> {
    return await UserModel.find({role:"customer"}).lean();
  }

  async deleteById(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

    async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async createUser(userData: Omit<IUser, 'id'>): Promise<IUser> {
    return await UserModel.create(userData);
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }
}