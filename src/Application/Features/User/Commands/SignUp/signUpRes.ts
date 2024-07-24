import { Signup } from "./Types/api.js";

export const signUpRes = {
  customize: async (
    result: Signup.IUserDto,
    accessTokenInfoObj: Signup.IJwtTokenObject,
  ): Promise<Signup.ISignUpResponse> => {
    const response: Signup.ISignUpResponse = {
      data: {
        accessToken: accessTokenInfoObj.token,
        accessExpired: accessTokenInfoObj.expire,
        user: {
          id: result.id,
          name: result.name,
          lifeRole: result.lifeRole,
          email: result.email,
          links: result.links,
        },
      },
    };
    return response;
  },
};
