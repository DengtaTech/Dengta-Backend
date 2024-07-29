import { User, UserCredential } from './entities.ts';

declare namespace GetUserInfo {
  interface IGetUserInfoResponse {
    data: {
      user: User;
    };
  }
}
