import { Database } from '../../Database/data-source.js';
import { searchHistoryRepo } from '../Repository/searchHistoryRepo.js';
import { SearchHistoryRetrieve } from '../../Application/Features/SearchHistory/Queries/GetHistory/Types/api.js';
import { userRepo } from '../Repository/userRepo.js';
import { WrongTokenError } from '../../Errors/errors.js';

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
};
