import jwt from 'jsonwebtoken';
import { Signup } from '../Application/Features/User/Commands/SignUp/Types/api.js';

export const auth = {
  generateAccessToken: async (
    userId: number,
  ): Promise<Dengta.IJwtTokenObject> => {
    const secretKey = process.env.JWT_SECRET as string;
    const payload = { id: userId };
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
    const tokenInfo: Dengta.IJwtTokenObject = {
      token: token,
      expire: `${60 * 60 * 24}`,
    };
    return tokenInfo;
  },
};
