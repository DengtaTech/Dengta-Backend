import { GetUserInfo } from './Types/api.js';

export const getUserInfoRes = {
  customize: async (
    user: GetUserInfo.UserWithHashtagsAndLinks,
  ): Promise<GetUserInfo.IGetUserInfoResponse> => {
    const response: GetUserInfo.IGetUserInfoResponse = {
      data: {
        user,
      },
    };
    return response;
  },
};
