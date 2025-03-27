import { followshipService } from '../../../../Infrastructure/Service/followshipService.js';
import { followRes } from './followRes.js';
import { UserFollow } from './Types/api.js';

export const followHandler = {
  handle: async (
    followReq: UserFollow.IFollowReq,
  ): Promise<UserFollow.IFollowResponse> => {
    await followshipService.follow(followReq);
    return await followRes.customize();
  },
};
