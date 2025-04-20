import { getMilvusClient } from '../../Database/VectorDB/vector-db.js';
import { embeddingService } from './embeddingService.js';
import { milvusUserIntervalsEmbeddingRepo } from '../Repository/milvusUserIntervalsEmbeddingRepo.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { userRepo } from '../Repository/userRepo.js';
import {
  EMBEDDING_WEIGHTS,
  RECOMMENDATION_LIMIT,
} from '../../Config/constants.js';
import { GetSimilarUser } from '../../Application/Features/Recommendation/GetSimilarUser/Types/api.js';
import { followshipRepo } from '../Repository/followshipRepo.js';
import { Footprint } from '../../Database/Entities/footprint.js';
import logger from '../../Database/Logger/index.js';

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
    console.log(res);

    const similarUserIds = res.results.map((result) => {
      return {
        user: {
          id: result.userId,
          fullName: '',
          lifeRole: '',
          selfIntro: '' as string | null,
          followerCount: 0,
          hashtags: [] as string[],
          avatar: null as string | null,
        },
        similarity: result.score,
        startFootprintId: result.startFootprintId,
        endFootprintId: result.endFootprintId,
        startFootprintAge: (0 as number) || undefined,
        endFootprintAge: (0 as number) || undefined,
        endFootprint: null as Footprint | null,
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

      const user = await userRepo.findById(similarUser.user.id, undefined, [
        'mUserProfileHashTag',
        'mUserProfileHashTag.profileHashTag',
      ]);
      logger.info(`user: ${user}`);

      if (!user) {
        throw new Error('[get similar user] user should not be null');
      }
      const followerCount = await followshipRepo.getFollowerCountByUserId(
        user.id,
      );
      similarUser.user.fullName = user.fullName;
      similarUser.user.lifeRole = user.lifeRole;
      similarUser.user.selfIntro = user.selfIntro;
      similarUser.user.hashtags = user.hashtags;
      similarUser.user.followerCount = followerCount;
      similarUser.user.avatar = user.avatar ? user.avatar : null;
      // Edge case? -> no footprints
      if (!startFootprint || !endFootprint) {
        similarUser.startFootprintAge = undefined;
        similarUser.endFootprintAge = undefined;
        similarUser.endFootprint = null;
        continue;
      }

      if (!user.birthday) throw new Error('User birthday should not be null');
      const birthday = new Date(user.birthday);

      const startFootprintAge =
        startFootprint.occurAt.getFullYear() - birthday.getFullYear();
      const endFootprintAge =
        endFootprint.occurAt.getFullYear() - birthday.getFullYear();

      similarUser.startFootprintAge = startFootprintAge;
      similarUser.endFootprintAge = endFootprintAge;
      similarUser.endFootprint = endFootprint;
    }
    return similarUserIds;
  },
};
