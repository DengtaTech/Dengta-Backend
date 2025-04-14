import { Database } from '../../Database/data-source.js';
import { searchHistoryRepo } from '../Repository/searchHistoryRepo.js';
import { SearchHistoryRetrieve } from '../../Application/Features/SearchHistory/GetHistory/Types/api.js';
import { userRepo } from '../Repository/userRepo.js';
import { UserNotFoundError } from '../../Errors/errors.js';
import { Search } from '../../Application/Features/SearchHistory/Search/Types/api.js';
import { User } from '../../Database/Entities/user.js';

export const searchHistoryService = {
  getSearchHistory: async (
    searchInfoObj: SearchHistoryRetrieve.IUserDto,
  ): Promise<SearchHistoryRetrieve.ISearchHistoryDto> => {
    const checkUserExist = await userRepo.findById(searchInfoObj.id);
    if (!checkUserExist) {
      throw new UserNotFoundError();
    }
    const searchHistory = await searchHistoryRepo.getByUserId(
      searchInfoObj.id,
      15,
    );
    return searchHistory.map((hist) => hist.content);
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
  search: async (searchInfoObj: Search.ISearchInfoDto): Promise<User[]> => {
    return Database.transaction(async (transactionManager) => {
      try {
        await searchHistoryRepo.insertNewSearchHistory(
          searchInfoObj,
          transactionManager,
        );
        const result = await userRepo.findByNameAndTag({
          keywords: searchInfoObj.searchContent,
          transactionManager,
          skip: (searchInfoObj.page - 1) * 20,
          limit: 20,
        });
        // Don't include the searcher
        return result.filter((usr) => usr.id !== searchInfoObj.userId);
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
};
