import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { PublishFootprint } from './Types/api.js';
import { publishFootprintRes } from './publishFootprintRes.js';

export const publishFootprintHandler = {
  handle: async (
    userId: string,
    reqBody: PublishFootprint.IPublishFootprintReqBody,
  ): Promise<PublishFootprint.IPublishFootprintResponse> => {
    //init
    let response = null;

    const result = await footprintService.publish(userId, reqBody);

    response = await publishFootprintRes.customize(result);

    return response;
  },
};