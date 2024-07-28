import { Signin } from './Types/api.js';
import { Dengta } from '../../../../../Types/common.js';

export const signInRes = {
  customize: async (
    result: Signin.ISignInDto,
    accessTokenInfoObj: Dengta.IJwtTokenObject,
  ): Promise<Signin.ISignInResponse> => {
    const response: Signin.ISignInResponse = {
      data: {
        accessToken: accessTokenInfoObj.token,
        accessExpired: accessTokenInfoObj.expire,
        user: {
          id: result.id,
          email: result.email,
        },
      },
    };
    return response;
  },
};
