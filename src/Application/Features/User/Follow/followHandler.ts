import { followshipService } from '../../../../Infrastructure/Service/followshipService.js';
import { notificationService } from '../../../../Infrastructure/Service/notificationService.js';
import { followRes } from './followRes.js';
import { UserFollow } from './Types/api.js';

export const followHandler = {
  handle: async (
    followReq: UserFollow.IFollowReq,
  ): Promise<UserFollow.IFollowResponse> => {
    const followResult = await followshipService.follow(followReq);
    const notifyDto: UserFollow.INotifyDto = {
      followerInfo: followResult.followerInfo,
      followeeEmail: followResult.followeeEmail,
      followeeId: followResult.followeeId,
    };
    await notificationService.onNewFollow(notifyDto);
    return await followRes.customize();
  },
};
