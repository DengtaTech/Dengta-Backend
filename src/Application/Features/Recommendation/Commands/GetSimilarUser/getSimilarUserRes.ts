export const getSimilarUserRes = {
  customize: async (
    result: GetSimilarUser.ISimilarUser[],
  ): Promise<GetSimilarUser.IGetSimilarUserResponse> => {
    const response: GetSimilarUser.IGetSimilarUserResponse = {
      data: {
        similarUsers: result,
      },
    };
    return response;
  },
};
