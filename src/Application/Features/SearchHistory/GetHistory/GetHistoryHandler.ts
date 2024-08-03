import { searchHistoryService } from '../../../../Infrastructure/Service/searchHistoryService.js';
import { SearchHistoryRetrieve } from './Types/api.js';

export const getSearchHistoryHandler = {
  handle: async (
    body: SearchHistoryRetrieve.ISearchHistoryRetrieveReq,
  ): Promise<SearchHistoryRetrieve.ISearchHistoryRetrieveRes> => {
    const result = await searchHistoryService.getSearchHistory({
      id: body.userId,
    });
    return { data: { searchHistory: result } };
  },
};
