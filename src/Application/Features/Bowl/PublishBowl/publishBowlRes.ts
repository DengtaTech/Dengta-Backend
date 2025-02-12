import { Bowl } from '../../../../Database/Entities/bowl.js';
import { PublishBowl } from './Types/api.js';

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
