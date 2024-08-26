import { User } from '../../../../Database/Entities/user.js';
import { Search } from './Types/api.js';

export const searchRes = {
  customize: async (
    keyword: string,
    result: User[],
  ): Promise<Search.ISearchRes> => {
    const response: Search.ISearchRes = {
      data: {
        keyword,
        searchResult: result.map((usr) => ({
          id: usr.id,
          fullName: usr.fullName,
          lifeRole: usr.lifeRole,
          avatar: usr.avatar,
          selfIntro: usr.selfIntro,
          profileHashTags: usr.mUserProfileHashTag!.map(
            (hashTag) => hashTag.profileHashTag!.content,
          ),
        })),
      },
    };
    return response;
  },
};
