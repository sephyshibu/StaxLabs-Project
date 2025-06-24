import { IUserRepository } from '../../../domain/repositories/IUserrepository';

export class BlockUser {
  constructor(private repo: IUserRepository) {}

   async blockUser(userId: string): Promise<void> {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error('User not found');
    await this.repo.blockUser(userId);
  }
}