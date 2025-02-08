import { GetBowlList } from '../../Application/Features/Bowl/GetBowlList/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { Bowl } from '../../Database/Entities/bowl.js';
import { MBowlPush } from '../../Database/Entities/mBowlPush.js';
import logger from '../../Database/Logger/index.js';
import { bowlRepo } from '../Repository/bowlRepo.js';
import { userRepo } from '../Repository/userRepo.js';

export const bowlService = {
  publishBowl: async (
    commenterId: string,
    authorId: string,
    comment: string,
  ): Promise<Bowl> => {
    if (
      (await userRepo.findById(commenterId)) === null ||
      (await userRepo.findById(authorId)) === null
    ) {
      throw new Error(
        'When publishing a bowl, both commenter and author must exist',
      );
    }
    return Database.transaction(async (transactionManager) => {
      try {
        const newBowl = new Bowl();
        newBowl.content = comment;
        newBowl.userId = authorId;
        newBowl.commenterId = commenterId;
        newBowl.status = 'waiting';
        return await transactionManager.save(newBowl);
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  getBowlList: async (
    userId: string,
    targetId: string,
    page: number,
  ): Promise<GetBowlList.IBowlDto[] | []> => {
    if (
      (await userRepo.findById(targetId)) === null ||
      (await userRepo.findById(userId)) === null
    ) {
      throw new Error('When getting Bowl List, user should exist');
    }
    console.log('userId', userId);
    console.log('targetId', targetId);
    if (userId !== targetId) {
      return await bowlRepo.getBowlListByOther(userId, page);
    }
    return await bowlRepo.getBowlListByAuthor(userId, page);
  },
  pushOrCancel: async (userId: string, bowlId: string): Promise<void> => {
    const bowl = await bowlRepo.findById(bowlId);
    if (!bowl) {
      throw new Error('Bowl should exist but not found');
    }
    if ((await userRepo.findById(userId)) === null) {
      throw new Error('User should exist but not found');
    }
    const existingMBowlPush = await MBowlPush.findOne({
      where: { userId, bowlId },
    });
    return await Database.transaction(async (transactionManager) => {
      try {
        if (existingMBowlPush === null) {
          const newPush = transactionManager.create(MBowlPush, {
            userId,
            bowlId,
          });
          bowl.totalPushCount += 1;
          await transactionManager.save(bowl);
          await transactionManager.save(newPush);
          return;
        }
        if (existingMBowlPush.status === 'deleted') {
          existingMBowlPush.status = 'normal';
          bowl.totalPushCount += 1;
        } else {
          existingMBowlPush.status = 'deleted';
          bowl.totalPushCount -= 1;
        }
        await transactionManager.save(bowl);
        await transactionManager.save(existingMBowlPush);
        return;
      } catch (error) {
        logger.error(error, 'Error in DB layer');
        throw error;
      }
    });
  },
};
