import { User } from '../../../../Database/Entities/user.js';
import { userService } from '../../../../Infrastructure/Service/userService.js';
import { searchFolloweesRes } from './searchFolloweesRes.js';
import { SearchFollowees } from './Types/api.js';

export const searchFolloweesHandler = {
  handle: async (
    followerId: User['id'],
    keywords?: string,
  ): Promise<SearchFollowees.ISearchFolloweesRes> => {
    const result = await userService.searchFollowees(followerId, keywords);
    return await searchFolloweesRes.customize(result);
  },
};
