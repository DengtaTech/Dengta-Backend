import { recommendationService } from '../../../../Infrastructure/Service/recommendationService.js';
import { getSimilarUserRes } from './getSimilarUserRes.js';

export const getSimilarUserHandler = {
  getSimilarUser: async (
    userId: string,
    body: GetSimilarUser.IGetSimilarUserReq,
  ): Promise<GetSimilarUser.IGetSimilarUserResponse> => {
    const { goal } = body;

    // goal可能還要弄個模板化：比如用戶只輸入前端工程師時--> 我想要成為「前端工程師」etc.
    const result = await recommendationService.getSimilarUsers(userId, goal);
    return getSimilarUserRes.customize(result);
  },
};
