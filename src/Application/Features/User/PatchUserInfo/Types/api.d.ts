import { User } from '../../../../../Database/Entities/user.js';
import { Link } from '../../../../../Database/Entities/link.js';
import { Dengta } from '../../../../../Types/common.js';
declare namespace PatchUserInfo {
  type PatchUserInfoReqBody = Partial<
    Pick<
      User,
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
    links: Dengta.ILink[];
  };
}
