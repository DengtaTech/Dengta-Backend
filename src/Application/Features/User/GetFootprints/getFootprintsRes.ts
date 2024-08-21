import { GetFootprints } from './Types/api.js';

export const getFootprintsRes = {
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
