import { bowlService } from '../../../../Infrastructure/Service/bowlService.js';
import { publishBowlRes } from './publishBowlRes.js';

export const publishBowlHandler = {
  handle: async (
    commenterId: string,
    authorId: string,
    comment: string,
  ): Promise<PublishBowl.IPublishBowlResponse> => {
    const result = await bowlService.publishBowl(
      commenterId,
      authorId,
      comment,
    );

    return await publishBowlRes.customize(result);
  },
};
