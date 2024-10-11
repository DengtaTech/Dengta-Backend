import { Bowl } from '../../../../Database/Entities/bowl.js';

export const publishBowlRes = {
  customize: async (
    result: Bowl,
  ): Promise<PublishBowl.IPublishBowlResponse> => {
    return {
      data: {
        bowl: result,
      },
    };
  },
};
