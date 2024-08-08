import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { initFootprintRes } from './initFootprintRes.js';

import { InitFootprint } from './Types/api.js';

export const initFootprintHandler = {
  handle: async (
    userId: string,
    status: string,
  ): Promise<InitFootprint.IInitFootprintResponse> => {
    //init
    let response = null;

    const result = await footprintService.initFootprint(userId, status);

    response = await initFootprintRes.customize(result);

    return response;
  },
};
