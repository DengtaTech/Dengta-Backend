import { GetBowlList } from '../../Application/Features/Bowl/GetBowlList/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { Bowl } from '../../Database/Entities/bowl.js';
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
    targetId: string,
    isAuthor: boolean,
    page: number,
  ): Promise<GetBowlList.IBowlDto[] | []> => {
    if ((await userRepo.findById(targetId)) === null) {
      throw new Error('When getting Bowl List, user should exist');
    }
    // 效能上考量的區分
    if (isAuthor) {
      return await bowlRepo.getBowlListByAuthor(targetId, page);
    } else {
      return await bowlRepo.getBowlListByOther(targetId, page);
    }
  },
};
