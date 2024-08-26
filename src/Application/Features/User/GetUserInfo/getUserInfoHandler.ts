import { userService } from '../../../../Infrastructure/Service/userService.js';
import { getUserInfoRes } from './getUserInfoRes.js';
import { GetUserInfo } from './Types/api.js';

export const getUserInfoHandler = {
  handle: async (userId: string): Promise<GetUserInfo.IGetUserInfoResponse> => {
    const user = await userService.getUserInfo(userId);
    const response = await getUserInfoRes.customize(user);
    return response;
  },
};
