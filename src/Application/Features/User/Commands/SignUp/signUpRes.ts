export const signUpRes = {
  customize: async (
    result: Signup.IUserObject,
    accessTokenInfoObj: Signup.IJwtTokenObject,
  ): Promise<Signup.ISignUpResponse> => {
    const response: Signup.ISignUpResponse = {
      data: {
        accessToken: accessTokenInfoObj.token,
        accessExpired: accessTokenInfoObj.expire,
        user: {
          id: result.id,
          provider: result.provider,
          name: result.name,
          lifeRole: result.lifeRole,
          email: result.email,
          avatar: result.avatar,
        },
      },
    };
    return response;
  },
};
