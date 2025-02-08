import { bowlService } from '../../../../Infrastructure/Service/bowlService.js';
import { getBowlListRes } from './getBowlListRes.js';
import { GetBowlList } from './Types/api.js';

export const getBowlListHandler = {
  handle: async (
    userId: string,
    targetId: string,
    page: number,
  ): Promise<GetBowlList.IGetBowlListResponse> => {
    const result = await bowlService.getBowlList(
      targetId,
      userId === targetId,
      page,
    );

    return await getBowlListRes.customize(result);
  },
};
