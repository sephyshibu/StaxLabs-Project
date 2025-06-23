import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../../domain/repositories/IUserrepository';
import { generateAccessToken, generateRefreshToken } from '../../../infrastructure/token/tokenUtils';

export class LoginUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async login(email: string, password: string,timezone:string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.password) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }
}
