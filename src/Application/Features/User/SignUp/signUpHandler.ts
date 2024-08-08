import { userService } from '../../../../Infrastructure/Service/userService.js';
import { tool } from '../../../../utils/tool.js';
import { auth } from '../../../../utils/jwt.js';
import { signUpRes } from './signUpRes.js';
import { Signup } from './Types/api.js';

export const signUpHandler = {
  handle: async (body: Signup.ISignUpReq): Promise<Signup.ISignUpResponse> => {
    //init variables
    const provider: string = 'native';
    const {
      firstName,
      lastName,
      lifeRole,
      gender,
      birthday,
      email,
      password,
      links,
      clerkId,
    } = body;

    const hashedPassword = await tool.generateHashPassword(password);
    const userInfoObj: Signup.ISignUpReq = {
      firstName: firstName,
      lastName: lastName,
      lifeRole: lifeRole,
      gender: gender,
      birthday: birthday,
      email: email,
      password: hashedPassword,
      provider: provider,
      avatar: '',
      links: links,
      clerkId,
    };
    const result = await userService.signUp(userInfoObj);
    const tokenInfo = await auth.generateAccessToken(result.id);
    return await signUpRes.customize(result, tokenInfo);
  },
};
