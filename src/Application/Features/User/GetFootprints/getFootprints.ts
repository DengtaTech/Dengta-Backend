import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { getFootprintsRes } from './getFootprintsRes.js';
import { GetFootprints } from './Types/api.js';

export const getFootprintsHandler = {
  handle: async (
    userId: string,
    page: number,
  ): Promise<{ data: GetFootprints.TFootprintResponse }> => {
    const footprints = await footprintService.getFootprintByUserId(
      userId,
      page,
    );
    const response = await getFootprintsRes.customize(footprints);
    return response;
  },
};
