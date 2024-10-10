import { GetUserInfo } from '../GetUserInfo/Types/api.js';

export const getPublicUserInfoRes = {
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
