import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { GetFootprints } from '../GetFootprints/Types/api.js';
import { getPublicFootprintsRes } from './getPublicFootprintsRes.js';

export const getPublicFootprintsHandler = {
  handle: async (
    cardUrl: string,
    page: number,
  ): Promise<{ data: GetFootprints.TFootprintResponse }> => {
    const footprints = await footprintService.getPublicFootprintByCardUrl(
      cardUrl,
      page,
    );
    const response = await getPublicFootprintsRes.customize(footprints);
    return response;
  },
};
