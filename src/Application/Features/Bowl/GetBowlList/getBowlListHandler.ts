import { bowlService } from '../../../../Infrastructure/Service/bowlService.js';
import { getBowlListRes } from './getBowlListRes.js';

export const getBowlListHandler = {
  handle: async (userId: string): Promise<GetBowlList.IGetBowlListResponse> => {
    const result = await bowlService.getBowlList(userId);

    return await getBowlListRes.customize(result);
  },
};
