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
import { GetSimilarUser } from '../../Application/Features/Recommendation/GetSimilarUser/Types/api.js';
import { followshipRepo } from '../Repository/followshipRepo.js';

export const recommendationService = {
  getSimilarUsers: async (
    userId: string,
    goal: string,
  ): Promise<GetSimilarUser.ISimilarUserDto[]> => {
    let lastIntervelEmbedding =
      await milvusUserIntervalsEmbeddingRepo.getLastIntervelEmbeddingByUserId(
        userId,
      );

    if (lastIntervelEmbedding.length === 0) {
      const footprintCount =
        await footprintRepo.getPublishedFootprintCountByUserId(userId);

      // 如果用戶沒有足跡，則直接從用戶資料做推薦
      if (footprintCount === 0) {
        lastIntervelEmbedding =
          await embeddingService.getUserWithoutFootprintWeightedEmbedding(
            userId,
          );
      } else {
        lastIntervelEmbedding =
          await embeddingService.getUserPartialIntervalWeightedEmbedding(
            userId,
          );
      }
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
        user: {
          id: result.userId,
          fullName: '',
          lifeRole: '',
          selfIntro: ('' as string) || null,
          followerCount: 0,
          hashtags: ([] as string[]) || [],
        },
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

      const user = await userRepo.findById(similarUser.user.id, undefined, [
        'mUserProfileHashTag',
        'mUserProfileHashTag.profileHashTag',
      ]);

      if (!user) {
        throw new DatabaseError();
      }
      const followerCount = await followshipRepo.getFollowerCountByUserId(
        user.id,
      );
      similarUser.user.fullName = user.fullName;
      similarUser.user.lifeRole = user.lifeRole;
      similarUser.user.selfIntro = user.selfIntro;
      similarUser.user.hashtags = user.hashtags;
      similarUser.user.followerCount = followerCount;

      if (!user.birthday) throw new DatabaseError();
      const birthday = new Date(user.birthday);

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
