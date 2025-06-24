import { Request, Response } from 'express';
import { GetAllUsers } from '../../application/usecase/Users/GetAllUsers';
import { DeleteUser } from '../../application/usecase/Users/DeleteUser';
import { BlockUser } from '../../application/usecase/Users/BlockUser';
import { UnBlockUser } from '../../application/usecase/Users/UnblockUser';


export class UserController {
  constructor(
    private readonly getAllUsers: GetAllUsers,
    private readonly deleteUser: DeleteUser,
    private readonly blockuser: BlockUser,
    private readonly unblockuser: UnBlockUser,

  ) {}

  getUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.getAllUsers.execute();
    res.json(users);
  };

  deleteUserById = async (req: Request, res: Response): Promise<void> => {
    await this.deleteUser.execute(req.params.id);
    res.sendStatus(204);
  };
 blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await this.blockuser.blockUser(id);
  res.status(200).json({ message: 'User blocked' });
};

unblockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await this.unblockuser.unblockUser(id);
  res.status(200).json({ message: 'User unblocked' });
};


}
