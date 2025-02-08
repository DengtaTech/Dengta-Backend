import logger from '../../Database/Logger/index.js';
import { GetBowlList } from '../../Application/Features/Bowl/GetBowlList/Types/api.js';
import { Bowl } from '../../Database/Entities/bowl.js';

export const bowlRepo = {
  getBowlListByOther: async (
    currentUserId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetBowlList.IBowlDto[] | []> => {
    try {
      // bowl_id, bow_creatAt --> TypeORM 在進行 pagination 時會自動搞子查詢，此修改可以避免 alias 衝突問題
      const query = Bowl.createQueryBuilder('bowl')
        .leftJoin(
          'MBowlLikes',
          'like',
          'like.bowlId = bowl.id AND like.userId = :currentUserId',
          { currentUserId },
        )
        // 使用 CASE 語法來判斷該用戶是否有按讚：有則回傳 1，否則 0
        .select([
          'bowl.id AS bowl_id',
          'bowl.content AS content',
          'bowl.status AS status',
          'bowl.userId AS userId',
          'bowl.commenterId AS commenterId',
          'bowl.createdAt AS bowl_createdAt',
          'bowl.totalPushCount AS totalPushCount',
          'CASE WHEN like.userId IS NOT NULL THEN 1 ELSE 0 END AS isPushed',
        ])
        .orderBy('bowl.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);
      // 當有用到select--> getRawMany();
      const [data] = await query.getRawMany();
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
        .select([
          'bowl.id AS bowl_id',
          'bowl.content AS content',
          'bowl.status AS status',
          'bowl.userId AS userId',
          'bowl.commenterId AS commenterId',
          'bowl.createdAt AS bowl_createdAt',
          'bowl.totalPushCount AS totalPushCount',
        ])
        .orderBy('bowl.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);
      const [bowls] = await query.getRawMany();
      if (!bowls) return [];
      return bowls;
    } catch (error) {
      logger.error(error, 'Failed to get bowl list by author:');
      throw error;
    }
  },
};
