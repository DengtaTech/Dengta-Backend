import { Response } from 'express';
import { userService } from '../../../../../Infrastructure/Service/userService.js';
import { tool } from '../../../../../utils/tool.js';
import { errorMsg } from '../../../../../utils/errorMsg.js';
import { auth } from '../../../../../utils/auth.js';
import { signUpRes } from './signUpRes.js';

export const signUpHandler = {
  handle: async (
    res: Response<Dengta.oError>,
    realName: string,
    accountName: string,
    email: string,
    password: string,
  ): Promise<Signup.ISignUpResponse | undefined> => {
    //init variables
    let provider: string = 'native';
    let response = null;
 
    const hashedPassword = await tool.generateHashPassword(password);
    const userInfoObj: Signup.ISignUpObject = {
      realName: realName,
      accountName: accountName,
      email: email,
      password: hashedPassword,
      provider: provider,
      avatar: '',
    };
    const user = await userService.signUp(res, userInfoObj);
    if (user === null) {
      errorMsg.emailExist(res);
      return;
    }
    // undefined means error occured in Service
    if (user === undefined) {
      return;
    }
    console.log(user);
    const tokenInfo = await auth.generateAccessToken(user.id);

    response = await signUpRes.customize(user, tokenInfo);
    return response;
  },
};
