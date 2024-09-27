import { getMilvusClient } from '../../Database/VectorDB/vector-db.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';

export const milvusUserIntervalsEmbeddingRepo = {
  getAllIntervalsByUserId: async (
    userId: string,
  ): Promise<Embedding.IIntervalEmbedding[]> => {
    const milvusClient = getMilvusClient();
    const res = await milvusClient.query({
      collection_name: 'user_intervals_embedding',
      filter: `userId == '${userId}'`,
      output_fields: [
        'id',
        'userId',
        'startFootprintId',
        'endFootprintId',
        'embedding',
      ],
    });

    return res.data.map((interval) => {
      return {
        id: interval.id,
        userId: interval.userId,
        startFootprintId: interval.startFootprintId,
        endFootprintId: interval.endFootprintId,
        embedding: interval.embedding,
      };
    });
  },

  getLastIntervelEmbeddingByUserId: async (
    userId: string,
  ): Promise<number[]> => {
    const milvusClient = getMilvusClient();
    const res = await milvusClient.query({
      collection_name: 'user_intervals_embedding',
      filter: `userId == '${userId}'`,
      output_fields: ['endFootprintId', 'embedding'],
    });

    if (res.data.length === 0) {
      return [];
    }

    const lastIntervel = res.data.reduce((prev, current) => {
      return prev.endFootprintId > current.endFootprintId ? prev : current;
    });

    return lastIntervel.embedding;
  },

  insertIntervalsEmbedding: async (
    intervalsEmbedding: Embedding.IIntervalEmbedding[],
  ) => {
    try {
      const milvusClient = getMilvusClient();
      await milvusClient.insert({
        collection_name: 'user_intervals_embedding',
        data: intervalsEmbedding,
      });
    } catch (error) {
      console.error('Failed to insert intervalsEmbedding:');
      throw error;
    }
  },
  deleteAllIntervalsByUserId: async (userId: string) => {
    try {
      const milvusClient = getMilvusClient();
      await milvusClient.delete({
        collection_name: 'user_intervals_embedding',
        filter: `userId == '${userId}'`,
      });
    } catch (error) {
      console.error('Failed to delete intervalsEmbedding:');
      throw error;
    }
  },
};
