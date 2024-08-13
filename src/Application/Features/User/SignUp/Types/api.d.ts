import { User } from '../../../../../Database/Entities/user.js';
import { UserCredential } from '../../../../../Database/Entities/userCredential.js';
import { Dengta } from '../../../../../Types/common.js';
declare namespace Signup {
  type SignupUserInput = Pick<
    User,
    | 'firstName'
    | 'lastName'
    | 'lifeRole'
    | 'birthday'
    | 'gender'
    | 'email'
    | 'clerkId'
  > & {
    links: Dengta.ILink[];
  };

  type SignupCredentialsInput = Pick<UserCredential, 'password'>;

  interface ISignUpReq extends SignupUserInput, SignupCredentialsInput {
    provider?: string;
    avatar?: string;
  }
  //Dto專門用於Service層組資料，回傳給Handler用
  interface ISignUpDto
    extends Pick<User, 'id' | 'fullName' | 'lifeRole' | 'email' | 'clerkId'> {
    links: Dengta.ILink[];
  }
  interface ISignUpResponse {
    data: {
      accessToken: string;
      accessExpired: string;
      user: ISignUpDto;
    };
  }
}
