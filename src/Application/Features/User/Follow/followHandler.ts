import { followshipService } from '../../../../Infrastructure/Service/followshipService.js';
import { followRes } from './followRes.js';
import { UserFollow } from './Types/api.js';

export const followHandler = {
  handle: async (
    followReq: UserFollow.IFollowReq,
  ): Promise<UserFollow.IFollowRes> => {
    const followship = await followshipService.follow(followReq);
    return followRes.customize(followship);
  },
};
