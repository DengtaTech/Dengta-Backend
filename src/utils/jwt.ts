import jwt from 'jsonwebtoken';
import { Dengta } from '../Types/common.js';

type JwtPayload = {
  id: number;
};

export function isTJwtTokenPayload(
  obj: unknown,
): obj is Dengta.TJwtTokenPayload {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'exp' in obj &&
    'iat' in obj &&
    typeof obj.id === 'string' &&
    typeof obj.exp === 'number' &&
    typeof obj.iat === 'number'
  );
}

export const auth = {
  generateAccessToken: async (
    userId: number,
  ): Promise<Dengta.IJwtTokenObject> => {
    const secretKey = process.env.JWT_SECRET as string;
    const payload: JwtPayload = { id: userId };
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
    const tokenInfo: Dengta.IJwtTokenObject = {
      token: token,
      expire: `${60 * 60 * 24}`,
    };
    return tokenInfo;
  },
};
