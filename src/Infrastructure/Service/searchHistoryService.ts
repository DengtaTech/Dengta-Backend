import { Database } from '../../Database/data-source.js';
import { searchHistoryRepo } from '../Repository/searchHistoryRepo.js';
import { SearchHistoryRetrieve } from '../../Application/Features/SearchHistory/Queries/GetHistory/Types/api.js';
import { userRepo } from '../Repository/userRepo.js';
import { WrongTokenError } from '../../Errors/errors.js';
import { SearchHistory } from '../../Database/Entities/searchHistory.js';
import { Search } from '../../Application/Features/SearchHistory/Commands/Search/Types/api.js';
import { EntityManager } from 'typeorm';

export const searchHistoryService = {
  getSearchHistory: async (
    searchInfoObj: SearchHistoryRetrieve.IUserDto,
  ): Promise<SearchHistoryRetrieve.ISearchHistoryDto> => {
    return Database.transaction(async (transactionManager) => {
      try {
        const checkUserExist = await userRepo.findById(
          searchInfoObj.id,
          transactionManager,
        );
        if (!checkUserExist) {
          throw new WrongTokenError();
        }
        const searchHistory = await searchHistoryRepo.getByUserId(
          searchInfoObj.id,
          15,
          transactionManager,
        );
        return searchHistory.map((hist) => hist.content);
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  clearSearchHistory: async (searchInfoObj: SearchHistoryRetrieve.IUserDto) => {
    return Database.transaction(async (transactionManager) => {
      try {
        const checkUserExist = await userRepo.findById(
          searchInfoObj.id,
          transactionManager,
        );
        if (!checkUserExist) {
          throw new WrongTokenError();
        }
        const clearResult = await searchHistoryRepo.deleteByUserId(
          searchInfoObj.id,
          transactionManager,
        );
        return clearResult;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  insertNewSearchHistory: async (
    searchInfo: Search.ISearchInfoDto,
    transactionManager?: EntityManager,
  ): Promise<SearchHistory> => {
    return Database.transaction(async (mgr) => {
      if (!transactionManager) {
        transactionManager = mgr;
      }
      try {
        const checkUserExist = await userRepo.findById(
          searchInfo.userId,
          transactionManager,
        );
        if (!checkUserExist) {
          throw new WrongTokenError();
        }
        const newSearchHistory = await searchHistoryRepo.insertNewSearchHistory(
          searchInfo,
          transactionManager,
        );
        return newSearchHistory;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
};
