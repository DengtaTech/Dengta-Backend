import { userService } from '../../../../../Infrastructure/Service/userService.js';
import { tool } from '../../../../../utils/tool.js';
import { auth } from '../../../../../utils/auth.js';
import { signUpRes } from './signUpRes.js';


export const signUpHandler = {
  handle: async (
    realName: string,
    accountName: string,
    email: string,
    password: string,
  ): Promise<Signup.ISignUpResponse> => {
    //init variables
    const provider: string = 'native';
    const hashedPassword = await tool.generateHashPassword(password);
    const userInfoObj: Signup.ISignUpObject = {
      realName: realName,
      accountName: accountName,
      email: email,
      password: hashedPassword,
      provider: provider,
      avatar: '',
    };
    const user = await userService.signUp(userInfoObj);
    const tokenInfo = await auth.generateAccessToken(user.id);
    return signUpRes.customize(user, tokenInfo);
  },
};
