import { User, UserCredential } from './entities';

declare namespace GetUserInfo {
  interface IGetUserInfoResponse {
    data: {
      user: User;
    };
  }
}
