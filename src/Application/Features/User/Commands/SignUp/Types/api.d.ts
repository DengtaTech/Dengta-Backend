declare namespace Signup {
  
  interface IUserObject {
    id: number;
    provider: string;
    email: string;
    name: string;
    lifeRole: string;
    avatar: Dengta.UserAvatar;
  }
  interface ILink {
    type: string;
    url: string;
  }
  interface ISignUpReq {
    name: string;
    lifeRole: string;
    gender: Dengta.Gender;
    birthday: string;
    email: string;
    password: string;
    links: ILink[];
  }
  interface ISignUpObject {
    name: string;
    lifeRole: string;
    provider: string;
    email: string;
    password: string;
    gender: Dengta.Gender;
    birthday: Date;
    avatar: Dengta.UserAvatar;
    links: ILink[];
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
