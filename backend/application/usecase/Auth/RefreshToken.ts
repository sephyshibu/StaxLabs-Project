import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../../infrastructure/token/tokenUtils';

export class RefreshToken {
  async refresh(refreshToken: string): Promise<string> {
    if (!refreshToken) throw new Error('Missing token');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const newaccesstoken=jwt.sign({id:decoded.id, role: decoded.role}, process.env.JWT_SECRET!,{expiresIn:"15m"});
    // const payload = { id: decoded.id, role: decoded.role };
     console.log("new access tokenn in tech use case", newaccesstoken)
     return newaccesstoken
  }
}
