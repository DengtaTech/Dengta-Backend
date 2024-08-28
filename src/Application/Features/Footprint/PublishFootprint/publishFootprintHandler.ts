import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { embeddingService } from '../../../../Infrastructure/Service/embeddingService.js';
import { PublishFootprint } from './Types/api.js';
import { publishFootprintRes } from './publishFootprintRes.js';

export const publishFootprintHandler = {
  handle: async (
    reqBody: PublishFootprint.IPublishFootprintReqBody,
  ): Promise<PublishFootprint.IPublishFootprintResponse> => {
    //init
    let response = null;

    const result = await footprintService.publish(reqBody);

    response = await publishFootprintRes.customize(result);

    await embeddingService.initFootprintEmbedding({
      id: result.id,
      title: result.title,
      content: result.content,
    });

    return response;
  },
};
