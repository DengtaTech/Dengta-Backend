import { Database } from '../../Database/data-source.js';
import { searchHistoryRepo } from '../Repository/searchHistoryRepo.js';
import { SearchHistoryRetrieve } from '../../Application/Features/SearchHistory/Queries/GetHistory/Types/api.js';
import { userRepo } from '../Repository/userRepo.js';
import { UserNotFoundError } from '../../Errors/errors.js';
import { Search } from '../../Application/Features/SearchHistory/Commands/Search/Types/api.js';
import { User } from '../../Database/Entities/user.js';

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
          throw new UserNotFoundError();
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
          throw new UserNotFoundError();
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
  search: async (
    searchInfoObj: Search.ISearchInfoDto
  ): Promise<User[]> => {
    return Database.transaction(async (transactionManager) => {
      try {
        await searchHistoryRepo.insertNewSearchHistory(
          searchInfoObj,
          transactionManager,
        );
        const result = await userRepo.findByNameAndTag(
          searchInfoObj.searchContent,
          transactionManager,
        );
        return result;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
};