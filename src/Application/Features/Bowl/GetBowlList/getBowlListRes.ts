import { Bowl } from '../../../../Database/Entities/bowl.js';

export const getBowlListRes = {
  customize: async (
    result: Bowl[],
  ): Promise<GetBowlList.IGetBowlListResponse> => {
    return {
      data: {
        bowls: result,
      },
    };
  },
};
