import { getMilvusClient } from '../../Database/VectorDB/vector-db.js';

export const recommendationService = {
  collectSentences(userData: GetSimilarUser.IEmbeddingUserData): string[] {
    const sentences = [userData.selfIntro, userData.goal];
    userData.profileTags.forEach((tag) => sentences.push(tag));
    userData.footPrints.forEach((footPrint) => {
      sentences.push(footPrint.title);
      footPrint.tags.forEach((tag) => sentences.push(tag));
      sentences.push(footPrint.description);
    });
    return sentences;
  },
  getSimilarUsers: async (
    userId: number,
    goal: string,
    limit: number,
  ): Promise<GetSimilarUser.ISimilarUser[]> => {
    const lastIntervelEmbedding =
      await recommendationService.getLastIntervelEmbeddingByUserId(userId);

    const goalEmbeddingArr =
      await recommendationService.getEmbeddingBySentences([goal]);
    const goalEmbedding = goalEmbeddingArr[0];

    const goalWeight = 0.3;

    const mixedEmbedding = lastIntervelEmbedding.map((value, index) => {
      return value * (1 - goalWeight) + goalEmbedding[index] * goalWeight;
    });

    const milvusClient = getMilvusClient();
    const res = await milvusClient.search({
      collection_name: 'user_intervals_embedding',
      filter: 'userId != ' + userId,
      group_by_field: 'userId',
      vector: mixedEmbedding,
      limit,
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
  getEmbeddingBySentences: async (sentences: string[]): Promise<number[][]> => {
    const res = await fetch(
      `http://${process.env.EMBEDDING_SERVER_URL}:${process.env.EMBEDDING_SERVER_PORT}/embed`,
      {
        method: 'POST',
        body: JSON.stringify({ sentences }),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const data = (await res.json()) as GetSimilarUser.IEmbeddingResponse;
    return data.embeddings;
  },
  getLastIntervelEmbeddingByUserId: async (
    userId: number,
  ): Promise<number[]> => {
    const milvusClient = getMilvusClient();
    const res = await milvusClient.query({
      collection_name: 'user_intervals_embedding',
      filter: 'userId == ' + userId,
      output_fields: ['endFootprintId', 'embedding'],
    });

    const lastIntervel = res.data.reduce((prev, current) => {
      return prev.endFootprintId > current.endFootprintId ? prev : current;
    });

    return lastIntervel.embedding;
  },
  calculateUserEmbedding: async (
    userData: GetSimilarUser.IEmbeddingUserData,
  ): Promise<GetSimilarUser.IEmbeddingUserVector> => {
    const sentences = recommendationService.collectSentences(userData);

    const embedding =
      await recommendationService.getEmbeddingBySentences(sentences);

    let index = 0;
    const userEmbedding = {
      userId: userData.userId,
      selfIntro: embedding[index],
      goal: embedding[++index],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      profileTags: userData.profileTags.map((_) => embedding[++index]),
      footprints: userData.footPrints.map((footPrint) => {
        return {
          footPrintId: footPrint.footPrintId,
          title: embedding[++index],
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          tags: footPrint.tags.map((_) => embedding[++index]),
          description: embedding[++index],
        };
      }),
    };

    return userEmbedding;
  },

  getUserWeightedEmbedding: async (
    userEmbedding: GetSimilarUser.IEmbeddingUserVector,
    intervalSize: number,
  ): Promise<GetSimilarUser.IIntervalEmbedding[]> => {
    const embeddingWeights = {
      selfIntro: 0.1,
      goal: 0.3,
      profileTags: 0.2,
      footprints: {
        title: 0.2,
        tags: 0.1,
        description: 0.05,
      },
      questionnaire: 0.05,
    };

    const weightedIntervalsEmbedding = [];
    for (let i = 0; i <= userEmbedding.footprints.length - intervalSize; i++) {
      const intervalFootprints = userEmbedding.footprints.slice(
        i,
        i + intervalSize,
      );

      const intervalEmbedding = Array(userEmbedding.selfIntro.length).fill(0);

      const addIntervalEmbedding = (embedding: number[], weight: number) => {
        for (let i = 0; i < embedding.length; i++) {
          intervalEmbedding[i] += embedding[i] * weight;
        }
      };

      addIntervalEmbedding(userEmbedding.selfIntro, embeddingWeights.selfIntro);

      addIntervalEmbedding(userEmbedding.goal, embeddingWeights.goal);

      userEmbedding.profileTags.forEach((tagEmbedding) => {
        addIntervalEmbedding(tagEmbedding, embeddingWeights.profileTags);
      });

      intervalFootprints.forEach((footprint) => {
        addIntervalEmbedding(
          footprint.title,
          embeddingWeights.footprints.title,
        );
        footprint.tags.forEach((tagEmbedding) => {
          addIntervalEmbedding(tagEmbedding, embeddingWeights.footprints.tags);
        });
        addIntervalEmbedding(
          footprint.description,
          embeddingWeights.footprints.description,
        );
      });

      weightedIntervalsEmbedding.push({
        userId: userEmbedding.userId,
        startFootprintId: intervalFootprints[0].footPrintId,
        endFootprintId:
          intervalFootprints[intervalFootprints.length - 1].footPrintId,
        embedding: intervalEmbedding,
      });
    }

    return weightedIntervalsEmbedding;
  },

  addUserDataToMilvus: async (
    userData: GetSimilarUser.IEmbeddingUserData,
    intervalSize: number,
  ) => {
    const userEmbedding =
      await recommendationService.calculateUserEmbedding(userData);

    const userWeightedIntervalsEmbedding =
      await recommendationService.getUserWeightedEmbedding(
        userEmbedding,
        intervalSize,
      );

    const milvusClient = getMilvusClient();
    await milvusClient.insert({
      collection_name: 'user_intervals_embedding',
      data: userWeightedIntervalsEmbedding,
    });
  },
};
