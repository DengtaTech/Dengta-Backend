import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { embeddingService } from '../../../../Infrastructure/Service/embeddingService.js';
import { PublishFootprint } from './Types/api.js';
import { publishFootprintRes } from './publishFootprintRes.js';
import { mentionService } from '../../../../Infrastructure/Service/mentionService.js';

export const publishFootprintHandler = {
  handle: async (
    userId: string,
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

    await embeddingService.addNewIntervalInMilvus(userId);

    mentionService.analyzeContent(
      result.title + ' ' + result.content,
      result.createdAt,
      'footprints',
    );

    return response;
  },
};
