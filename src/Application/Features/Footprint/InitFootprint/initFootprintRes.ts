import { InitFootprint } from './Types/api.js';

export const initFootprintRes = {
  customize: async (
    result: InitFootprint.IInitFootprintDto
  ): Promise<InitFootprint.IInitFootprintResponse> => {
    const response: InitFootprint.IInitFootprintResponse = {
      data: {
        footprint: {
            id: result.id
        },
      },
    };
    return response;
  },
};
