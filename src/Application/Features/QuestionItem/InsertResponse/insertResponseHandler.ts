import { MUserQuestionItem } from '../../../../Database/Entities/mUserQuestionItem.js';
import { questionItemService } from '../../../../Infrastructure/Service/questionItemService.js';
import { insertResponseRes } from './insertResponseRes.js';
import { InsertResponse } from './Types/api.js';

export const insertResponseHandler = {
  handle: async (
    userId: string,
    questionItemId: number,
    response: MUserQuestionItem['response'],
  ): Promise<InsertResponse.TRes> => {
    const userQuestionItem = await questionItemService.insertQuestionResponse(
      userId,
      questionItemId,
      response,
    );
    if (!userQuestionItem) {
      throw new Error('Failed to insert response');
    }
    return insertResponseRes.customize();
  },
};
