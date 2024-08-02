import { User_ProfileHashTag } from '../../../../../Database/Entities/users_profileHashTags.ts';
import { User } from '../../../../../Database/Entities/User.js';
import { Link } from '../../../../../Database/Entities/Link.js';
declare namespace Search {
  interface ISearchReq {
    userId: string;
    content: string;
  }

  interface ISearchRes {
    data: {
      keyword: string;
      searchResult: ISearchResultDto;
    };
  }

  interface ISearchInfoDto {
    userId: string;
    searchContent: string;
  }

  type ISearchResultDto = Array<{
    id: typeof User.prototype.id;
    fullName: typeof User.prototype.fullName;
    lifeRole: typeof User.prototype.lifeRole;
    avatar: typeof User.prototype.avatar;
    selfIntro: typeof User.prototype.selfIntro;
    profileHashTags: NonNullable<
      NonNullable<
        typeof User.prototype.user_profileHashTag
      >[number]['profileHashTag']
    >['content'][];
  }>;

  type IUserDto = Pick<
    User,
    'id' | 'fullName' | 'lifeRole' | 'avatar' | 'selfIntro' | 'profileHashTags'
  >;
}
