import { UserFollow } from '../../Application/Features/User/Follow/Types/api.js';
import { UserUnFollow } from '../../Application/Features/User/UnFollow/Types/api.js';
import { Database } from '../../Database/data-source.js';
import logger from '../../Database/Logger/index.js';
import { UserNotFoundError } from '../../Errors/errors.js';
import { followshipRepo } from '../Repository/followshipRepo.js';
import { userRepo } from '../Repository/userRepo.js';
export const followshipService = {
  follow: async (
    followProps: UserFollow.TFollowProps,
  ): Promise<UserFollow.IFollowDto> => {
    return Database.transaction(async (transactionManager) => {
      const follower = await userRepo.findById(
        followProps.followerId,
        transactionManager,
      );
      if (follower === null) {
        throw new UserNotFoundError();
      }
      const followee = await userRepo.findById(
        followProps.followeeId,
        transactionManager,
      );
      if (followee === null) {
        throw new UserNotFoundError();
      }
      try {
        await followshipRepo.follow(followProps, transactionManager);
        followee.helpCount += 1;
        await transactionManager.save(followee);
        return {
          followerInfo: follower,
          followeeEmail: followee.email,
          followeeId: followee.id,
        };
      } catch (error) {
        logger.error(error, 'Error in DB ->');
        throw error;
      }
    });
  },
  unfollow: async (unfollowDto: UserUnFollow.IUnFollowDto): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      const follower = await userRepo.findById(
        unfollowDto.followerId,
        transactionManager,
      );
      if (follower === null) {
        throw new UserNotFoundError();
      }
      const followee = await userRepo.findById(
        unfollowDto.followeeId,
        transactionManager,
      );
      if (followee === null) {
        throw new UserNotFoundError();
      }
      try {
        return await followshipRepo.unfollow(unfollowDto, transactionManager);
      } catch (error) {
        logger.error(error, 'Error in DB ->');
        throw error;
      }
    });
  },
};
