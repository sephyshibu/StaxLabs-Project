import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../../domain/repositories/IUserrepository';
import { UserRole } from '../../../domain/model/IUser';

export class SignupUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async signup(name: string, email: string, password: string, role: UserRole,timezone:string) {
    const hashed = await bcrypt.hash(password, 10);
    return await this.userRepo.createUser({ name, email, password: hashed, role,timezone });
  }
}
