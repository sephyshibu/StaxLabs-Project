import express from 'express';
import { AuthController } from '../Cotnroller/auth.controller';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepoImpl';
import { LoginUser } from '../../application/usecase/Auth/LoginUser';
import { SignupUser } from '../../application/usecase/Auth/Signupuser';
import { RefreshToken } from '../../application/usecase/Auth/RefreshToken';

const authrouter = express.Router();

// Instantiate dependencies
const userRepo = new UserRepositoryImpl();
const loginUser = new LoginUser(userRepo);
const signupUser = new SignupUser(userRepo);
const refreshToken = new RefreshToken();
const authController = new AuthController(loginUser, signupUser, refreshToken);

// Routes
authrouter.post('/login', (req, res) => authController.login(req, res));
authrouter.post('/register', (req, res) => authController.signup(req, res));
authrouter.post('/refresh-token', (req, res) => authController.refresh(req, res));
authrouter.post('/logout', (req, res) => authController.logout(req, res));

export default authrouter;
