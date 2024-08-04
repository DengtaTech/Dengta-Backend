import { User } from '../../../../../Database/Entities/user.js';
import { Link } from '../../../../../Database/Entities/link.js';
declare namespace PatchUserInfo {
  type ILink = Pick<Link, 'sourceName' | 'url'>;

  type PatchUserInfoReqBody = Partial<
    Pick<
      User,
      | 'fullName'
      | 'firstName'
      | 'lastName'
      | 'lifeRole'
      | 'birthday'
      | 'gender'
      | 'email'
      | 'phone'
      | 'selfIntro'
    >
  > & {
    links?: ILink[];
  };
}
