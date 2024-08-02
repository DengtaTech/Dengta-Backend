import { User } from '../../../../../Database/Entities/user.js';
import { UserCredential } from '../../../../../Database/Entities/userCredential.js';
declare namespace Signup {
  type ILink = Pick<Link, 'sourceName' | 'url'>;

  type SignupUserInput = Pick<
    User,
    | 'fullName'
    | 'firstName'
    | 'lastName'
    | 'lifeRole'
    | 'birthday'
    | 'gender'
    | 'email'
  > & {
    links: ILink[];
  };

  type SignupCredentialsInput = Pick<UserCredential, 'password'>;

  interface ISignUpReq extends SignupUserInput, SignupCredentialsInput {
    provider?: string;
    avatar?: string;
  }
  //Dto專門用於Service層組資料，回傳給Handler用
  interface ISignUpDto
    extends Pick<User, 'id' | 'fullName' | 'lifeRole' | 'email'> {
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
