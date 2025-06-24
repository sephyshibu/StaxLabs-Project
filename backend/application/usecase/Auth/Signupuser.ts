import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../../domain/repositories/IUserrepository';
import { UserRole } from '../../../domain/model/IUser';

export class SignupUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async signup(name: string, email: string, password: string, role: UserRole) {
    console.log("dasd",name,email,password,role)
     const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('Email already in use');
    }
    const hashed = await bcrypt.hash(password, 10);
    console.log("use case",name,email,password,role,hashed)
    return await this.userRepo.createUser({ name, email, password: hashed, role });
  }
}
