import { Signup } from './Types/api.js';
import { Dengta } from '../../../../Types/common.js';

export const signUpRes = {
  customize: async (
    result: Signup.ISignUpDto,
    accessTokenInfoObj: Dengta.IJwtTokenObject,
  ): Promise<Signup.ISignUpResponse> => {
    const response: Signup.ISignUpResponse = {
      data: {
        accessToken: accessTokenInfoObj.token,
        accessExpired: accessTokenInfoObj.expire,
        user: {
          id: result.id,
          fullName: result.fullName,
          lifeRole: result.lifeRole,
          email: result.email,
          clerkId: result.clerkId,
          links: result.links,
        },
      },
    };
    return response;
  },
};
