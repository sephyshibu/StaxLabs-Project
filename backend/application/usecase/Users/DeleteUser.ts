import { IUserRepository } from '../../../domain/repositories/IUserrepository';

export class DeleteUser {
  constructor(private repo: IUserRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.deleteById(id);
  }
}