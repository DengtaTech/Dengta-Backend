import { User, UserCredential } from './entities';

declare namespace Signin {
  type ILink = Pick<Link, 'type' | 'url'>;

  type SigninInput = Pick<UserCredential, 'email' | 'password'>;

  interface ISignInDto extends Pick<User, 'id'>, Pick<UserCredential, 'email'> {
    password?: string;
  }

  interface ISignInResponse {
    data: {
      accessToken: string;
      accessExpired: string;
      user: ISignInDto;
    };
  }
}
