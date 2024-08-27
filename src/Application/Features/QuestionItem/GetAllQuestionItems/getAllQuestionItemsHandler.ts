import { getAllQuestionItemsRes } from './getAllQuestionItemsRes.js';
import { questionItemService } from '../../../../Infrastructure/Service/questionItemService.js';
export const getAllQuestionItemsHandler = {
  handle: async () => {
    const questions = await questionItemService.getAllQuestionItems();
    return getAllQuestionItemsRes.customize(questions);
  },
};
