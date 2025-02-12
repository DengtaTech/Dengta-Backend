import { GetBowlList } from './Types/api.js';

export const getBowlListRes = {
  customize: async (
    result: GetBowlList.IBowlDto[] | [],
  ): Promise<GetBowlList.IGetBowlListResponse> => {
    return {
      data: {
        bowls: result,
      },
    };
  },
};
