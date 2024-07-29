import { userService } from '../../../../../Infrastructure/Service/userService.js';
import { minioService } from '../../../../../Infrastructure/Service/minioService.js';

import { UploadAvatarError } from '../../../../../Errors/errors.js';
import { getUserInfoRes } from './getUserInfoRes.js';
import { GetUserInfo } from './Types/api.js';

export const getUserInfoHandler = {
  handle: async (
    userId: string,
  ): Promise<GetUserInfo.IGetUserInfoResponse> => {
    const user = await userService.getUserInfo(userId);
    if (user.avatar){
        const presignedAvatarUrl = await minioService.getPresignedAvatarUrl(
          user.avatar,
        );
        if (presignedAvatarUrl) user.avatar = presignedAvatarUrl;
    }
    const response = await getUserInfoRes.customize(user);
    return response;
  },
};
