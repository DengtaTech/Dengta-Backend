import { Search } from '../../Application/Features/SearchHistory/Commands/Search/Types/api.js';
import { SearchHistory } from '../../Database/Entities/searchHistory.js';
import {
  EntityManager,
  Equal,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm';

export const searchHistoryRepo = {
  getByUserId: async (
    userId: string,
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
  deleteByUserId: async (
    userId: string,
    transactionManager?: EntityManager,
  ) => {
    try {
      const queryRules: FindOptionsWhere<SearchHistory> = {
        userId: Equal(userId),
      };
      if (transactionManager) {
        const searchHistory = await transactionManager.delete(
          SearchHistory,
          queryRules,
        );
        return searchHistory.affected;
      } else {
        const searchHistory = await SearchHistory.delete(queryRules);
        return searchHistory.affected;
      }
    } catch (error) {
      console.error('Error deleting search history by user id:');
      throw error;
    }
  },
  insertNewSearchHistory: async (
    { userId, searchContent }: Search.ISearchInfoDto,
    transactionManager?: EntityManager,
  ): Promise<void> => {
    try {
      const newSearchHistory = new SearchHistory();
      newSearchHistory.userId = userId;
      newSearchHistory.content = searchContent;
      if (transactionManager) {
        await transactionManager.save(
          newSearchHistory,
          { reload: false }, // https://github.com/typeorm/typeorm/issues/7643
        );
      } else {
        await newSearchHistory.save();
      }
    } catch (error) {
      console.error('Failed to save search history:');
      throw error;
    }
  },
};
