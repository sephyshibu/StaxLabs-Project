import express from 'express';
import { roleGuard } from '../../infrastructure/middleware/RoleGaurd';
import { UserController } from '../Cotnroller/user.controller';
import { GetAllUsers } from '../../application/usecase/Users/GetAllUsers';
import { DeleteUser } from '../../application/usecase/Users/DeleteUser';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepoImpl';
import { BlockUser } from '../../application/usecase/Users/BlockUser';
import { UnBlockUser } from '../../application/usecase/Users/UnblockUser';
import { CheckUSerStatus } from '../../application/usecase/Users/CheckSUSerStatus';
import { GetAllVendors } from '../../application/usecase/Users/GetAllVendors';


const userrouter = express.Router();

// DI
const repo = new UserRepositoryImpl();
const getAllUsers = new GetAllUsers(repo);
const deleteUser = new DeleteUser(repo);
const blockuser= new BlockUser(repo)
const unblockuser=new UnBlockUser(repo)
const checkuserstatus=new CheckUSerStatus(repo)
const getallvendors= new GetAllVendors(repo)




const controller = new UserController(getAllUsers, deleteUser, blockuser,unblockuser,checkuserstatus,getallvendors);

// Routes

userrouter.get('/', roleGuard(['admin']), controller.getUsers);
userrouter.get('/getallvendors', roleGuard(['admin']), controller.getAllVendors);
userrouter.patch('/:id/block',roleGuard(['admin']) ,controller.blockUser);
userrouter.patch('/:id/unblock', roleGuard(['admin']) ,controller.unblockUser);
userrouter.get('/:id',roleGuard(['admin']), controller.getstatusUserById);
export default userrouter;
