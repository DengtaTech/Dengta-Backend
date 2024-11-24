import { questionItemService } from '../../../../Infrastructure/Service/questionItemService.js';
import { embeddingService } from '../../../../Infrastructure/Service/embeddingService.js';
import { insertResponseRes } from './insertResponseRes.js';
import { InsertResponse } from './Types/api.js';

export const insertResponseHandler = {
  handle: async (
    userId: string,
    reqBody: InsertResponse.IReqBody,
  ): Promise<InsertResponse.TRes> => {
    await questionItemService.insertQuestionResponse(userId, reqBody);

    await Promise.all(
      reqBody.questionRes.map(async (item) => {
        await embeddingService.insertMUserQuestionItemEmbedding({
          userId,
          questionItemId: item.id,
          response: item.response,
        });
      }),
    );
    return insertResponseRes.customize();
  },
};
