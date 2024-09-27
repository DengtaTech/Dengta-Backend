import { userService } from '../../../../Infrastructure/Service/userService.js';
import { embeddingService } from '../../../../Infrastructure/Service/embeddingService.js';
import { patchUserInfoRes } from './patchUserInfoRes.js';
import { PatchUserInfo } from './Types/api.js';

export const patchUserInfoHandler = {
  handle: async (
    userId: string,
    updateFields: PatchUserInfo.PatchUserInfoReqBody,
  ): Promise<{
    message: string;
  }> => {
    await userService.updateUserInfo(userId, updateFields);

    await embeddingService.updateUserEmbedding(userId, {
      lifeRole: updateFields.lifeRole,
      selfIntro: updateFields.selfIntro,
    });

    return await patchUserInfoRes.customize();
  },
};
