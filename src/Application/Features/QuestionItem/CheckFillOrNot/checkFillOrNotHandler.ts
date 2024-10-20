import { QuestionItem } from '../../../../Database/Entities/questionItems.js';
import { questionItemService } from '../../../../Infrastructure/Service/questionItemService.js';
import { checkFillOrNotRes } from './checkFillOrNotRes.js';

export const checkFillOrNotHandler = {
  handle: async (
    userId: string,
  ): Promise<CheckFillOrNot.ICheckFillOrNotResponse> => {
    const result = await questionItemService.checkFillOrNot(userId);
    return checkFillOrNotRes.customize(result);
  },
};
