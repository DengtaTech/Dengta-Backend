import { userService } from '../../../../../Infrastructure/Service/userService.js';
import { tool } from '../../../../../utils/tool.js';
import { auth } from '../../../../../utils/auth.js';
import { signUpRes } from './signUpRes.js';
import { Signup } from './Types/api.js';


export const signUpHandler = {
  handle: async (
    body : Signup.ISignUpReq
  ): Promise<Signup.ISignUpResponse> => {
    //init variables
    const provider: string = 'native';
    const { name, lifeRole, gender, birthday, email, password, links } = body;

    const hashedPassword = await tool.generateHashPassword(password);
    const userInfoObj: Signup.ISignUpReq = {
      name: name,
      lifeRole: lifeRole,
      gender: gender,
      birthday: birthday,
      email: email,
      password: hashedPassword,
      provider: provider,
      avatar: '',
      links: links,
    };
    const result = await userService.signUp(userInfoObj);
    const tokenInfo = await auth.generateAccessToken(result.id);
    return signUpRes.customize(result, tokenInfo);
  },
};
