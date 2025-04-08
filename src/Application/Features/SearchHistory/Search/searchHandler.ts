import { searchHistoryService } from '../../../../Infrastructure/Service/searchHistoryService.js';
import { Search } from './Types/api.js';
import { searchRes } from './searchRes.js';
import { mentionService } from '../../../../Infrastructure/Service/mentionService.js';

export const searchHandler = {
  handle: async (body: Search.ISearchReq): Promise<Search.ISearchRes> => {
    const result = await searchHistoryService.search({
      userId: body.userId,
      searchContent: body.content,
      page: body.page,
    });
    mentionService.analyzeContent(body.content, new Date(), 'search');
    const response = await searchRes.customize(body.content, result);
    return response;
  },
};
