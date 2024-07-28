import { searchHistoryService } from '../../../../../Infrastructure/Service/searchHistoryService.js';
import { SearchHistoryClear } from './Types/api.js';

export const clearSearchHistoryHandler = {
  handle: async (
    body: SearchHistoryClear.ISearchHistoryClearReq,
  ): Promise<SearchHistoryClear.ISearchHistoryClearRes> => {
    const result = await searchHistoryService.clearSearchHistory({
      id: body.userId,
    });
    return { data: { count: result } };
  },
};
