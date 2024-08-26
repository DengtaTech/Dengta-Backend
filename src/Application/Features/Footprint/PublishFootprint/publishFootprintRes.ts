import { Footprint } from '../../../../Database/Entities/footprint.js';
import { PublishFootprint } from './Types/api.js';

export const publishFootprintRes = {
  customize: async (
    result: Footprint,
  ): Promise<PublishFootprint.IPublishFootprintResponse> => {
    const response: PublishFootprint.IPublishFootprintResponse = {
      data: {
        footrpint: result,
      },
    };
    return response;
  },
};
