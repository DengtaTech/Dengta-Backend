import { searchHistoryService } from '../../../../../Infrastructure/Service/searchHistoryService.js';
import { Database } from '../../../../../Database/data-source.js';
import { Search } from './Types/api.js';
import { userRepo } from '../../../../../Infrastructure/Repository/userRepo.js';

export const searchHandler = {
  handle: async (body: Search.ISearchReq): Promise<Search.ISearchRes> => {
    return Database.transaction(async (transactionManager) => {
      await searchHistoryService.insertNewSearchHistory(
        {
          userId: body.userId,
          searchContent: body.content,
        },
        transactionManager,
      );
      const result = await userRepo.findByNameAndTag(
        body.content,
        transactionManager,
      );
      return {
        data: {
          searchResult: result.map((usr) => ({
            id: usr.id,
            name: usr.name,
            lifeRole: usr.lifeRole,
            avatar: usr.avatar,
            selfIntro: usr.selfIntro,
            profileHashTags: usr.profileHashTags!.map(
              (hashTag) => hashTag.profileTagType!.content,
            ),
          })),
        },
      };
    });
  },
};
