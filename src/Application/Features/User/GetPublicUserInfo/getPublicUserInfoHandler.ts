import { userService } from '../../../../Infrastructure/Service/userService.js';
import { GetUserInfo } from '../GetUserInfo/Types/api.js';
import { getPublicUserInfoRes } from './getPublicUserInfoRes.js';

export const getPublicUserInfoHandler = {
  handle: async (
    cardUrl: string,
  ): Promise<GetUserInfo.IGetUserInfoResponse> => {
    const user = await userService.getPublicUserInfo(cardUrl);
    const response = await getPublicUserInfoRes.customize(user);
    return response;
  },
};
