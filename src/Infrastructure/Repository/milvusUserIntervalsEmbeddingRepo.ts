import { getMilvusClient } from '../../Database/VectorDB/vector-db.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import logger from '../../Database/Logger/index.js';

export const milvusUserIntervalsEmbeddingRepo = {
  getAllIntervalsByUserId: async (
    userId: string,
  ): Promise<Embedding.IIntervalEmbedding[]> => {
    try {
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
    } catch (error) {
      logger.error(error, 'Failed to get all intervalsEmbedding');
      throw error;
    }
  },

  getLastIntervelEmbeddingByUserId: async (
    userId: string,
  ): Promise<number[]> => {
    try {
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
    } catch (error) {
      logger.error(error, 'Failed to get last interval embedding');
      throw error;
    }
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
      logger.error(error, 'Failed to insert intervalsEmbedding');
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
      logger.error(error, 'Failed to delete all intervalsEmbedding');
      throw error;
    }
  },
};
