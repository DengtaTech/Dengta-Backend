import { getMilvusClient } from '../../Database/VectorDB/vector-db.js';
import { embeddingService } from './embeddingService.js';
import { milvusUserIntervalsEmbeddingRepo } from '../Repository/milvusUserIntervalsEmbeddingRepo.js';
import {
  EMBEDDING_WEIGHTS,
  RECOMMENDATION_LIMIT,
} from '../../Config/constants.js';
import { FootprintNotEnoughError } from '../../Errors/errors.js';

export const recommendationService = {
  getSimilarUsers: async (
    userId: string,
    goal: string,
  ): Promise<GetSimilarUser.ISimilarUser[]> => {
    const lastIntervelEmbedding =
      await milvusUserIntervalsEmbeddingRepo.getLastIntervelEmbeddingByUserId(
        userId,
      );

    if (lastIntervelEmbedding.length === 0) {
      throw new FootprintNotEnoughError();
    }

    const goalEmbeddingArr = await embeddingService.getEmbeddingBySentences([
      goal,
    ]);
    const goalEmbedding = goalEmbeddingArr[0];

    const goalWeight = EMBEDDING_WEIGHTS.goal;

    const mixedEmbedding = lastIntervelEmbedding.map((value, index) => {
      return value * (1 - goalWeight) + goalEmbedding[index] * goalWeight;
    });

    const milvusClient = getMilvusClient();
    const res = await milvusClient.search({
      collection_name: 'user_intervals_embedding',
      filter: `userId != '${userId}'`,
      group_by_field: 'userId',
      vector: mixedEmbedding,
      limit: RECOMMENDATION_LIMIT,
    });

    const similarUserIds = res.results.map((result) => {
      return {
        userId: result.userId,
        similarity: result.score,
        startFootprintId: result.startFootprintId,
        endFootprintId: result.endFootprintId,
      };
    });
    return similarUserIds;
  },
};
