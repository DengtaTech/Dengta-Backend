import { User } from '../../../../../Database/Entities/user.js';
declare namespace GetUserInfo {
  type UserWithHashtags = User & { hashtags: string[] | [] };
  interface IGetUserInfoResponse {
    data: {
      user: UserWithHashtags;
    };
  }
}
