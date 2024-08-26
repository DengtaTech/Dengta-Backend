import { recommendationService } from '../../../../Infrastructure/Service/recommendationService.js';
import { getSimilarUserRes } from './getSimilarUserRes.js';

export const getSimilarUserHandler = {
  getSimilarUser: async (
    body: GetSimilarUser.IGetSimilarUserReq,
  ): Promise<GetSimilarUser.IGetSimilarUserResponse> => {
    const { userId, goal } = body;
    const limit = 5;
    // goal可能還要弄個模板化：比如用戶只輸入前端工程師時--> 我想要成為「前端工程師」etc.
    const result = await recommendationService.getSimilarUsers(
      userId,
      goal,
      limit,
    );
    return getSimilarUserRes.customize(result);
  },
};
