import { GetSimilarUser } from './Types/api.js';

export const getSimilarUserRes = {
  customize: async (
    result: GetSimilarUser.ISimilarUserDto[],
  ): Promise<GetSimilarUser.IGetSimilarUserResponse> => {
    const response: GetSimilarUser.IGetSimilarUserResponse = {
      data: {
        similarUsers: result,
      },
    };
    return response;
  },
};
