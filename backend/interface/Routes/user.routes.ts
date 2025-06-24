import express from 'express';
import { roleGuard } from '../../infrastructure/middleware/RoleGaurd';
import { UserController } from '../Cotnroller/user.controller';
import { GetAllUsers } from '../../application/usecase/Users/GetAllUsers';
import { DeleteUser } from '../../application/usecase/Users/DeleteUser';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepoImpl';
import { BlockUser } from '../../application/usecase/Users/BlockUser';
import { UnBlockUser } from '../../application/usecase/Users/UnblockUser';

const userrouter = express.Router();

// DI
const repo = new UserRepositoryImpl();
const getAllUsers = new GetAllUsers(repo);
const deleteUser = new DeleteUser(repo);
const blockuser= new BlockUser(repo)
const unblockuser=new UnBlockUser(repo)
const controller = new UserController(getAllUsers, deleteUser, blockuser,unblockuser);

// Routes
userrouter.get('/', roleGuard(['admin']), controller.getUsers);
userrouter.delete('/:id', roleGuard(['admin']), controller.deleteUserById);
userrouter.patch('/:id/block',roleGuard(['admin']) ,controller.blockUser);
userrouter.patch('/:id/unblock', roleGuard(['admin']) ,controller.unblockUser);

export default userrouter;
