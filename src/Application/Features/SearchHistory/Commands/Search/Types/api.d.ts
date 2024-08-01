import { Link } from '../../../../../../Database/Entities/link.ts';
import { ProfileHashTag } from '../../../../../../Database/Entities/profileHashTag.ts';
import { User } from '../../../../../../Database/Entities/user.ts';

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
    name: typeof User.prototype.name;
    lifeRole: typeof User.prototype.lifeRole;
    avatar: typeof User.prototype.avatar;
    selfIntro: typeof User.prototype.selfIntro;
    profileHashTags: NonNullable<
      NonNullable<
        typeof User.prototype.profileHashTags
      >[number]['profileTagType']
    >['content'][];
  }>;

  type IUserDto = Pick<
    User,
    'id' | 'name' | 'lifeRole' | 'avatar' | 'selfIntro' | 'profileHashTags'
  >;
}
