import { EntityManager } from 'typeorm';
import { Followship } from '../../Database/Entities/followship.js';
import { InvalidInputError } from '../../Errors/errors.js';
import { UserFollow } from '../../Application/Features/User/Follow/Types/api.js';
import { UserUnFollow } from '../../Application/Features/User/UnFollow/Types/api.js';

export const followshipRepo = {
  follow: async (
    followDto: UserFollow.IFollowReq,
    transactionManager?: EntityManager,
  ): Promise<Followship> => {
    if (transactionManager) {
      if (await transactionManager.existsBy(Followship, followDto)) {
        throw new InvalidInputError('Followship already exists');
      }
      const followship = Followship.create({
        followerId: followDto.followerId,
        followeeId: followDto.followeeId,
      });
      return await transactionManager.save(followship);
    } else {
      if (await Followship.existsBy(followDto)) {
        throw new InvalidInputError('Followship already exists');
      }
      const followship = Followship.create({
        followerId: followDto.followerId,
        followeeId: followDto.followeeId,
      });
      return await followship.save();
    }
  },
  unfollow: async (
    unfollowDto: UserUnFollow.IUnFollowDto,
    transactionManager?: EntityManager,
  ): Promise<void> => {
    if (transactionManager) {
      const followship = await transactionManager.findOneBy(
        Followship,
        unfollowDto,
      );
      if (!followship) {
        throw new InvalidInputError('Followship does not exist');
      }
      await transactionManager.remove(followship);
    } else {
      const followship = await Followship.findOneBy(unfollowDto);
      if (!followship) {
        throw new InvalidInputError('Followship does not exist');
      }
      await followship.remove();
    }
  },
  getFollowerCountByUserId: async (userId: string): Promise<number> => {
    const count = await Followship.count({
      where: { followeeId: userId },
    });
    return count;
  },
};
