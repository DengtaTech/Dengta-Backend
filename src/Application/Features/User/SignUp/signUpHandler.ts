import { userService } from '../../../../Infrastructure/Service/userService.js';
import { embeddingService } from '../../../../Infrastructure/Service/embeddingService.js';
import { tool } from '../../../../utils/tool.js';
import { auth } from '../../../../utils/jwt.js';
import { signUpRes } from './signUpRes.js';
import { Signup } from './Types/api.js';
import { InputEmptyError } from '../../../../Errors/errors.js';

export const signUpHandler = {
  handle: async (body: Signup.ISignUpReq): Promise<Signup.ISignUpResponse> => {
    if (body.provider !== 'native') {
      const result = await userService.signUp(body);
      const tokenInfo = await auth.generateAccessToken(result.id);
      return await signUpRes.customize(result, tokenInfo);
    }
    if (!body.password) throw new InputEmptyError();
    const hashedPassword = await tool.generateHashPassword(
      body.password as string,
    );
    body.password = hashedPassword;

    const result = await userService.signUp(body);

    const tokenInfo = await auth.generateAccessToken(result.id);

    await embeddingService.initUserEmbedding({
      id: result.id,
      lifeRole: result.lifeRole,
      selfIntro: null,
    });

    return await signUpRes.customize(result, tokenInfo);
  },
};
