import { User } from "../../../../../Database/Entities/user.js";
import { GetUserInfo } from "./Types/api.js";

export const getUserInfoRes = {
  customize: async (
    user: User
  ): Promise<GetUserInfo.IGetUserInfoResponse> => {
    const response: GetUserInfo.IGetUserInfoResponse = {
      data: {
        user
      },
    };
    return response;
  },
};
