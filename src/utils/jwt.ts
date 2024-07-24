import jwt from 'jsonwebtoken';
import { Signup } from '../Application/Features/User/Commands/SignUp/Types/api.js';

export const auth = {
  generateAccessToken: async (
    userId: number,
  ): Promise<Signup.IJwtTokenObject> => {
    const secretKey = process.env.JWT_SECRET as string;
    const payload = { id: userId };
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
    const tokenInfo: Signup.IJwtTokenObject = {
      token: token,
      expire: `${60 * 60 * 24}`,
    };
    return tokenInfo;
  },
};
