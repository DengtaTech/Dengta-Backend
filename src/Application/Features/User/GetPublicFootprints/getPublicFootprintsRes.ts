import { GetFootprints } from '../GetFootprints/Types/api.js';

export const getPublicFootprintsRes = {
  customize: async (
    footprints: GetFootprints.TFootprintResponse,
  ): Promise<{ data: GetFootprints.TFootprintResponse }> => {
    const response = {
      data: {
        footprints: footprints.footprints,
      },
    };
    return response;
  },
};
