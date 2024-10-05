import { questionItemService } from '../../../../Infrastructure/Service/questionItemService.js';
import { insertResponseRes } from './insertResponseRes.js';
import { InsertResponse } from './Types/api.js';

export const insertResponseHandler = {
  handle: async (
    userId: string,
    reqBody: InsertResponse.IReqBody,
  ): Promise<InsertResponse.TRes> => {
    await questionItemService.insertQuestionResponse(userId, reqBody);
    return insertResponseRes.customize();
  },
};
