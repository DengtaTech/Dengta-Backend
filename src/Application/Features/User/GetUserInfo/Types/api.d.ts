import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { User } from '../../../../../Database/Entities/user.js';
import { Dengta } from '../../../../../Types/common.js';
declare namespace GetUserInfo {
  // type UserWithHashtags = User & { hashtags: string[] | [] };
  type UserWithHashtagsAndLinks = User & {
    links: Dengta.ILink[];
    hashtags: string[];
    cardUrl: string;
  };
  interface IGetUserInfoResponse {
    data: {
      user: UserWithHashtags;
    };
  }
}
