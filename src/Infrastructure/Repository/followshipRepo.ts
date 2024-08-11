import { EntityManager } from 'typeorm';
import { Followship } from '../../Database/Entities/followship.js';
import { InvalidInputError } from '../../Errors/errors.js';
import { UserFollow } from '../../Application/Features/User/Follow/Types/api.js';

export const followshipRepo = {
  follow: async (
    followDto: UserFollow.IFollowDto,
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
};
