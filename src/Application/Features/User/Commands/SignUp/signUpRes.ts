export const signUpRes = {
  customize: async (
    newUser: Signup.IUserObject,
    accessTokenInfoObj: Signup.IJwtTokenObject,
  ): Promise<Signup.ISignUpResponse> => {
    const response: Signup.ISignUpResponse = {
      data: {
        accessToken: accessTokenInfoObj.token,
        accessExpired: accessTokenInfoObj.expire,
        user: {
          id: newUser.id,
          provider: newUser.provider,
          realName: newUser.realName,
          accountName: newUser.accountName,
          email: newUser.email,
          avatar: newUser.avatar,
        },
      },
    };
    return response;
  },
};
