import { GetFootprintDetail } from './Types/api.js';

export const getFootprintDetailRes = {
  customize: async (
    footprint: GetFootprintDetail.FootprintDetailDto,
  ): Promise<GetFootprintDetail.FootprintDetailResponse> => {
    const response = {
      data: {
        footprint: footprint,
      },
    };
    return response;
  },
};
