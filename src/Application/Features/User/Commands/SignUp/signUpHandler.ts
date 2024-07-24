import { userService } from '../../../../../Infrastructure/Service/userService.js';
import { tool } from '../../../../../utils/tool.js';
import { auth } from '../../../../../utils/jwt.js';
import { signUpRes } from './signUpRes.js';


export const signUpHandler = {
  handle: async (
    body : Signup.ISignUpReq
  ): Promise<Signup.ISignUpResponse> => {
    //init variables
    const provider: string = 'native';
    const { name, lifeRole, gender, birthday, email, password, links } = body;
    const dateBirthday = new Date(birthday);
    const hashedPassword = await tool.generateHashPassword(password);
    const userInfoObj: Signup.ISignUpObject = {
      name: name,
      lifeRole: lifeRole,
      gender: gender,
      birthday: dateBirthday,
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
