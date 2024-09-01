import { UserFollow } from '../../Application/Features/User/Follow/Types/api.js';
import { UserUnFollow } from '../../Application/Features/User/UnFollow/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { Followship } from '../../Database/Entities/followship.js';
import { Notification } from '../../Database/Entities/notification.js';
import { UserNotFoundError } from '../../Errors/errors.js';
import { followshipRepo } from '../Repository/followshipRepo.js';
import { notificationRepo } from '../Repository/notificationRepo.js';
import { userRepo } from '../Repository/userRepo.js';

export const followshipService = {
  follow: async (followDto: UserFollow.IFollowDto): Promise<Followship> => {
    return Database.transaction(async (transactionManager) => {
      const follower = await userRepo.findById(
        followDto.followerId,
        transactionManager,
      );
      if (follower === null) {
        throw new UserNotFoundError();
      }
      const followee = await userRepo.findById(
        followDto.followeeId,
        transactionManager,
      );
      if (followee === null) {
        throw new UserNotFoundError();
      }
      try {
        const followship = await followshipRepo.follow(
          followDto,
          transactionManager,
        );

        // build notification
        const notification = Notification.create({
          userId: followDto.followeeId,
          type: 'is_followed',
          title: 'You just got new follower!',
          content: `${follower.firstName} is following you now!`,
          relatedUserId: followDto.followerId,
        });

        await notificationRepo.insertNewNotification(
          notification,
          transactionManager,
        );

        return followship;
      } catch (error) {
        console.error('Error in DB ->', error);
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
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
};
