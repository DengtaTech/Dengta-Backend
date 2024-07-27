import { recommendationService } from '../../../../../Infrastructure/Service/recommendationService.js';
import { getSimilarUserRes } from './getSimilarUserRes.js';

export const getSimilarUserHandler = {
  getSimilarUser: async (
    body: GetSimilarUser.IGetSimilarUserReq,
  ): Promise<GetSimilarUser.IGetSimilarUserResponse> => {
    const { userId, goal } = body;
    const limit = 5;
    const result = await recommendationService.getSimilarUsers(
      userId,
      goal,
      limit,
    );
    return getSimilarUserRes.customize(result);
  },
};
