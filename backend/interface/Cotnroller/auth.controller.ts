import { Request, Response } from 'express';
import { LoginUser } from '../../application/usecase/Auth/LoginUser';
import { SignupUser } from '../../application/usecase/Auth/Signupuser';
import { RefreshToken } from '../../application/usecase/Auth/RefreshToken';

export class AuthController {
  constructor(
    private loginUser: LoginUser,
    private signupUser: SignupUser,
    private refreshTokenUseCase: RefreshToken
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.loginUser.login(email, password);

      // res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
      res.status(200).json({ user, accessToken });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const user = await this.signupUser.signup(name, email, password, role);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      const newAccessToken = await this.refreshTokenUseCase.refresh(token);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (err: any) {
      res.status(403).json({ message: err.message });
    }
  }

  logout(_req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.sendStatus(200);
  }
}
