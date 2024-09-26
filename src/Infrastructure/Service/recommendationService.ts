import { getMilvusClient } from '../../Database/VectorDB/vector-db.js';
import { embeddingService } from './embeddingService.js';
import { milvusUserIntervalsEmbeddingRepo } from '../Repository/milvusUserIntervalsEmbeddingRepo.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { userRepo } from '../Repository/userRepo.js';
import {
  EMBEDDING_WEIGHTS,
  RECOMMENDATION_LIMIT,
} from '../../Config/constants.js';
import { DatabaseError } from '../../Errors/errors.js';

export const recommendationService = {
  getSimilarUsers: async (
    userId: string,
    goal: string,
  ): Promise<GetSimilarUser.ISimilarUser[]> => {
    let lastIntervelEmbedding =
      await milvusUserIntervalsEmbeddingRepo.getLastIntervelEmbeddingByUserId(
        userId,
      );

    // 如果用戶沒有interval，則取個人資料做推薦
    if (lastIntervelEmbedding.length === 0) {
      lastIntervelEmbedding =
        await embeddingService.getUserWithoutFootprintWeightedEmbedding(userId);
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
        startFootprintAge: 0,
        endFootprintAge: 0,
      };
    });

    // 計算start footprint與end footprint的用戶年齡
    for (const similarUser of similarUserIds) {
      const startFootprint = await footprintRepo.findById(
        similarUser.startFootprintId,
      );
      const endFootprint = await footprintRepo.findById(
        similarUser.endFootprintId,
      );

      if (!startFootprint || !endFootprint) {
        throw new DatabaseError();
      }

      const user = await userRepo.findById(similarUser.userId);

      const birthday = user?.birthday ? new Date(user.birthday) : null;

      if (!user || !birthday) {
        throw new DatabaseError();
      }

      const startFootprintAge =
        startFootprint.occurAt.getFullYear() - birthday.getFullYear();
      const endFootprintAge =
        endFootprint.occurAt.getFullYear() - birthday.getFullYear();

      similarUser.startFootprintAge = startFootprintAge;
      similarUser.endFootprintAge = endFootprintAge;
    }

    return similarUserIds;
  },
};
