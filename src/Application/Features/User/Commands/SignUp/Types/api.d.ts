declare namespace Signup {
  type UserPicture =
    | `https://${number}.${number}.${number}.${number}/${string}/${string}`
    | '';
  interface IUserObject {
    id: number;
    provider: string;
    email: string;
    realName: string;
    accountName: string;
    avatar: string;
  }
  interface ISignUpObject {
    realName: string;
    accountName: string;
    provider: string;
    email: string;
    password: string;
    avatar: UserPicture;
  }
  interface IJwtTokenObject {
    token: string;
    expire: string;
  }
  interface ISignUpResponse {
    data: {
      accessToken: string;
      accessExpired: string;
      user: Dengta.IUserObject;
    };
  }
}
