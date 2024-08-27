import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { getFootprintDetailRes } from './GetFootprintDetailRes.js';
import { GetFootprintDetail } from './Types/api.js';

export const getFootprintDetailHandler = {
  handle: async (
    footprintId: string,
  ): Promise<GetFootprintDetail.FootprintDetailResponse> => {
    //init
    const result = await footprintService.getFootprintDetail(footprintId);

    const response = await getFootprintDetailRes.customize(result);

    return response;
  },
};
