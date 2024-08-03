import { User } from '../../../../../Database/Entities/user.js';
declare namespace GetUserInfo {
  interface IGetUserInfoResponse {
    data: {
      user: User;
    };
  }
}
