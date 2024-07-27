import { SearchHistoryRetrieve } from '../../Application/Features/SearchHistory/Queries/GetHistory/Types/api.js';
import { SearchHistory } from '../../Database/Entities/searchHistory.js';
import { EntityManager, FindManyOptions } from 'typeorm';

export const searchHistoryRepo = {
  getByUserId: async (
    userId: number,
    topKRecent: number,
    transactionManager?: EntityManager,
  ): Promise<SearchHistory[]> => {
    try {
      const queryRules: FindManyOptions<SearchHistory> = {
        where: { userId: userId },
        order: { searchAt: 'DESC' },
        take: topKRecent,
      };
      if (transactionManager) {
        const searchHistory = transactionManager.find(
          SearchHistory,
          queryRules,
        );
        return searchHistory;
      } else {
        const searchHistory = await SearchHistory.find(queryRules);
        return searchHistory;
      }
    } catch (error) {
      console.error('Error finding search history by user id:');
      throw error;
    }
  },
};
