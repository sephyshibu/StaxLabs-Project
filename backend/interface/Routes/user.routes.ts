import express from 'express';
import { roleGuard } from '../../infrastructure/middleware/RoleGaurd';
import { UserController } from '../Cotnroller/user.controller';
import { GetAllUsers } from '../../application/usecase/Users/GetAllUsers';
import { DeleteUser } from '../../application/usecase/Users/DeleteUser';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepoImpl';

const userrouter = express.Router();

// DI
const repo = new UserRepositoryImpl();
const getAllUsers = new GetAllUsers(repo);
const deleteUser = new DeleteUser(repo);
const controller = new UserController(getAllUsers, deleteUser);

// Routes
userrouter.get('/', roleGuard(['admin']), controller.getUsers);
userrouter.delete('/:id', roleGuard(['admin']), controller.deleteUserById);

export default userrouter;
