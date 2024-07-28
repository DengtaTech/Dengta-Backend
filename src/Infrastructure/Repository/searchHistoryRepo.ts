import { SearchHistoryRetrieve } from '../../Application/Features/SearchHistory/Queries/GetHistory/Types/api.js';
import { SearchHistory } from '../../Database/Entities/searchHistory.js';
import {
  EntityManager,
  Equal,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm';

export const searchHistoryRepo = {
  insertNewSearchHistory: async (
    user: SearchHistoryRetrieve.IUserDto,
    searchContent: string,
    transactionManager?: EntityManager,
  ): Promise<SearchHistory> => {
    try {
      const newSearchHistory = new SearchHistory();
      newSearchHistory.userId = user.id;
      newSearchHistory.content = searchContent;
      if (transactionManager) {
        const savedSearchHistory =
          await transactionManager.save(newSearchHistory);
        return savedSearchHistory;
      } else {
        const savedSearchHistory = await newSearchHistory.save();
        return savedSearchHistory;
      }
    } catch (error) {
      console.error('Failed to save search history:');
      throw error;
    }
  },
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
  deleteByUserId: async (
    userId: number,
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
};
