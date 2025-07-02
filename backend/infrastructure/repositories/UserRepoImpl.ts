import {UserModel} from '../models/UserModel';
import { IUserRepository } from '../../domain/repositories/IUserrepository';
import { IUser } from '../../domain/model/IUser';

export class UserRepositoryImpl implements IUserRepository {
  async findAll(): Promise<IUser[]> {
    return await UserModel.find({role:"customer"}).lean();
  }
  async findAllVendor(): Promise<IUser[]> {
       return await UserModel.find({role:"vendor"}).lean();
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
  async findEmailById(id: string): Promise<string | null> {
  const user = await UserModel.findById(id, { email: 1 }).lean(); // Only project email field
  return user?.email || null;
}

  async blockUser(id: string): Promise<void> {
  await UserModel.findByIdAndUpdate(id, { isBlocked: true });
}


async unblockUser(id: string): Promise<void> {
  await UserModel.findByIdAndUpdate(id, { isBlocked: false });
}
async checkblockById(id: string): Promise<IUser | null> {
     const user = await UserModel.findById(id).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isBlocked: user.isBlocked,
      timezone: user.timezone,
    };
}

}