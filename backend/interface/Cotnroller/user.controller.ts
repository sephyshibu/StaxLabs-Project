import { Request, Response } from 'express';
import { GetAllUsers } from '../../application/usecase/Users/GetAllUsers';
import { DeleteUser } from '../../application/usecase/Users/DeleteUser';

export class UserController {
  constructor(
    private readonly getAllUsers: GetAllUsers,
    private readonly deleteUser: DeleteUser
  ) {}

  getUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.getAllUsers.execute();
    res.json(users);
  };

  deleteUserById = async (req: Request, res: Response): Promise<void> => {
    await this.deleteUser.execute(req.params.id);
    res.sendStatus(204);
  };
}
