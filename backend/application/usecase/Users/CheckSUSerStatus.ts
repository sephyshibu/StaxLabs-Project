import { IUserRepository } from '../../../domain/repositories/IUserrepository'
import { IUser } from '../../../domain/model/IUser';

export class CheckUSerStatus {
  constructor(private  userRepository: IUserRepository) {}

  async execute(id: string): Promise<IUser | null> {
    return await this.userRepository.checkblockById(id);
  }
}
