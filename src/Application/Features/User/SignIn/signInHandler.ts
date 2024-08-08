import { userService } from '../../../../Infrastructure/Service/userService.js';
import { tool } from '../../../../utils/tool.js';
import { auth } from '../../../../utils/jwt.js';
import { signInRes } from './signInRes.js';
import { Signin } from './Types/api.js';
import { WrongPasswordError } from '../../../../Errors/errors.js';

export const signInHandler = {
  handle: async (
    email: string,
    password: string,
    // 我覺得登入不用加 provider，都用 email 登入判斷就好
    provider: string,
  ): Promise<Signin.ISignInResponse> => {
    //先沒考慮第三方
    const result = await userService.signIn(email);

    if (!(await tool.confirmPassword(password, result.password as string)))
      throw new WrongPasswordError();

    const tokenInfo = await auth.generateAccessToken(result.id);
    return await signInRes.customize(result, tokenInfo);
  },
};
