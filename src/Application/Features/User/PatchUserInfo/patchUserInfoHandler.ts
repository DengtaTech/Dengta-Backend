import { userService } from '../../../../Infrastructure/Service/userService.js';
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
    return await patchUserInfoRes.customize();
  },
};
