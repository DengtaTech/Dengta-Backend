import { User, UserCredential } from "./entities";

declare namespace Signup {
  
  type ILink = Pick<Link, 'type' | 'url'>;

  type SignupUserInput = Pick<User, 'name' | 'lifeRole' | 'birthday' | 'gender'> & {
    links: ILink[];
  };

  type SignupCredentialsInput = Pick<UserCredential, 'email' | 'password'>;

  interface ISignUpReq extends SignupUserInput, SignupCredentialsInput {
    provider?: string;
    avatar?: string;
  }
  //Dto專門用於Service層組資料，回傳給Handler用
  interface ISignUpDto extends Pick<User, 'id' | 'name' | 'lifeRole'>, Pick<UserCredential, 'email'> {
    links: ILink[];
  }
  interface ISignUpResponse {
    data: {
      accessToken: string;
      accessExpired: string;
      user: ISignUpDto;
    };
  }
}
