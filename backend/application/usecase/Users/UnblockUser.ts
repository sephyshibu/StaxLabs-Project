import { IUserRepository } from '../../../domain/repositories/IUserrepository';

export class UnBlockUser {
  constructor(private repo: IUserRepository) {}

    async unblockUser(userId: string): Promise<void> {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error('User not found');
    await this.repo.unblockUser(userId);
  }
}