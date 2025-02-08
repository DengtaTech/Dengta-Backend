import logger from '../../Database/Logger/index.js';
import { GetBowlList } from '../../Application/Features/Bowl/GetBowlList/Types/api.js';
import { Bowl } from '../../Database/Entities/bowl.js';

export const bowlRepo = {
  findById: async (id: string): Promise<Bowl | null> => {
    try {
      console.log(id);
      const bowl = await Bowl.findOne({ where: { id } });
      console.log(bowl);
      return bowl;
    } catch (error) {
      logger.error(error, 'Failed to find bowl by id:');
      throw error;
    }
  },
  getBowlListByOther: async (
    currentUserId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetBowlList.IBowlDto[] | []> => {
    try {
      const bowls = await Bowl.createQueryBuilder('bowl')
        .leftJoinAndSelect(
          'bowl.pushCounts',
          'pushCounts',
          "pushCounts.userId = :currentUserId AND pushCounts.status = 'normal'",
          { currentUserId },
        )
        .orderBy('bowl.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
      const data: GetBowlList.IBowlDto[] = bowls.map((bowl) => ({
        id: bowl.id,
        content: bowl.content,
        status: bowl.status,
        userId: bowl.userId,
        commenterId: bowl.commenterId,
        createdAt: bowl.createdAt,
        totalPushCount: bowl.totalPushCount,
        isPushed: bowl.pushCounts && bowl.pushCounts.length > 0 ? true : false,
      }));

      if (!data) return [];
      return data;
    } catch (error) {
      logger.error(error, 'Failed to get bowl list by other:');
      throw error;
    }
  },
  getBowlListByAuthor: async (
    authorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetBowlList.IBowlDto[] | []> => {
    try {
      const query = Bowl.createQueryBuilder('bowl')
        .where('bowl.userId = :authorId', { authorId })
        .select(['bowl'])
        .orderBy('bowl.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);
      const [bowls] = await query.getManyAndCount();
      if (!bowls) return [];
      return bowls;
    } catch (error) {
      logger.error(error, 'Failed to get bowl list by author:');
      throw error;
    }
  },
};
