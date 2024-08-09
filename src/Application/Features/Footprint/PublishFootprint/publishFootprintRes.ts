import { PublishFootprint } from './Types/api.js';

export const publishFootprintRes = {
  customize: async (
    result: PublishFootprint.IPublishFootprintDto,
  ): Promise<PublishFootprint.IPublishFootprintResponse> => {
    const response: PublishFootprint.IPublishFootprintResponse = {
      data: {
        id: result.id,
        message: 'Footprint published successfully',
      },
    };
    return response;
  },
};
