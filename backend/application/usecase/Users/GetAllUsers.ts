import { IUserRepository } from '../../../domain/repositories/IUserrepository';
import { IUser } from '../../../domain/model/IUser';

export class GetAllUsers {
  constructor(private repo: IUserRepository) {}

  async execute(): Promise<IUser[]> {
    return await this.repo.findAll();
  }
}