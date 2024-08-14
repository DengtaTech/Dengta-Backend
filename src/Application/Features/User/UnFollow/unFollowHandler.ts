import { followshipService } from '../../../../Infrastructure/Service/followshipService.js';
import { UserUnFollow } from './Types/api.js';

export const unFollowHandler = {
  handle: async (
    unFollowReq: UserUnFollow.IUnFollowReq,
  ): Promise<UserUnFollow.IUnFollowRes> => {
    await followshipService.unfollow(unFollowReq);
  },
};
