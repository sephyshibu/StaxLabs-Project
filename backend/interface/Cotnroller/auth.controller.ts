import { Request, Response } from 'express';
import { LoginUser } from '../../application/usecase/Auth/LoginUser';
import { SignupUser } from '../../application/usecase/Auth/Signupuser';
import { RefreshToken } from '../../application/usecase/Auth/RefreshToken';
import jwt from 'jsonwebtoken'
export class AuthController {
  constructor(
    private loginUser: LoginUser,
    private signupUser: SignupUser,
    private refreshTokenUseCase: RefreshToken
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password,timezone } = req.body;
      const { user, accessToken, refreshToken } = await this.loginUser.login(email, password,timezone);
      
      // res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' });
      console.log("refresh token", refreshToken)
      console.log("accesstokjen",accessToken)
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax',secure: false, // true if using HTTPS
  path: '/api/auth' });
      res.status(200).json({ user, accessToken });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      console.log("regis", req.body)
      const user = await this.signupUser.signup(name, email, password, role);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      console.log("refeeh")
      const token = req.cookies.refreshToken;
      console.log("token", token)
      const newAccessToken = await this.refreshTokenUseCase.refresh(token);
      const decoded = jwt.decode(newAccessToken) as { id: string; role: string };

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: decoded.id,
        role: decoded.role,
      }
    });
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
