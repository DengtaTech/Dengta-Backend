import { User } from '../../../../Database/Entities/user.js';
import { userService } from '../../../../Infrastructure/Service/userService.js';
import { searchFolloweesRes } from './searchFolloweesRes.js';
import { SearchFollowees } from './Types/api.js';

export const searchFolloweesHandler = {
  handle: async (
    keywords: string,
    followerId: User['id'],
  ): Promise<SearchFollowees.ISearchFolloweesRes> => {
    const result = await userService.searchFollowees(keywords, followerId);
    return await searchFolloweesRes.customize(result);
  },
};
